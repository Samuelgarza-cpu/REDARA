import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buscador de INE',
        href: '/asistencia',
    },
];
type RegisterForm = {
    voter_code: string;
    photo: File | null;
};

const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const MB = 1048576;

const videoWidth = esMovil ? 720 : 1080;
const videoHeight = esMovil ? 1080 : 720;

// Coordenadas y tamaño del recorte en proporción a la resolución del video
const cropWidth = videoWidth * 0.5; // 20% del ancho total
const cropHeight = videoHeight * 0.5; // 15% del alto total
const cropX = videoWidth * 0.5; // 10% desde la izquierda
const cropY = videoHeight * 0.5; // 7% desde la parte superior
export default function Asistencia() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvaRef = useRef<HTMLCanvasElement | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        voter_code: '',
        photo: null,
    });
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [nameBtn, setNameBtn] = useState('CAMARA');
    const [showCanvas, setShowCanvas] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const cargarImagenYProcesarOCR = async (base64Image: string) => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY_ORC;
            const visionResponse = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
                requests: [
                    {
                        image: { content: base64Image },
                        features: [{ type: 'TEXT_DETECTION' }],
                    },
                ],
            });

            const informacionINE = visionResponse.data.responses[0].textAnnotations;
            const IndexClaveElector = informacionINE.findIndex((OCR: any) => OCR.description === 'ELECTOR');

            if (IndexClaveElector !== -1) {
                const voter_codeOCR = informacionINE[IndexClaveElector + 1]['description'];

                verificarVoterCode(voter_codeOCR);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontró la clave de elector en la imagen.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se encontró la clave de elector en la imagen.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const verificarVoterCode = async (voterCode: string) => {
        try {
            const response = await axios.post(route('verificar.voter_code'), { voter_code: voterCode });

            if (response.data.existe) {
                Swal.fire({
                    title: 'Voto Registrado.',
                    icon: 'success',
                    draggable: true,
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'El código de elector no está registrado.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            console.error('Error al verificar el código de elector:', error);
        }
    };

    const verCamara = () => {
        setShowVideo(true);
        setShowCanvas(false);
        const constraints = {
            video: esMovil
                ? { width: videoWidth, height: videoHeight, facingMode: { exact: 'environment' } } // Cámara trasera en móviles
                : { width: videoWidth, height: videoHeight }, // Cámara por defecto en escritorio
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                setStream(stream);
                const miVideo = videoRef.current;
                if (miVideo) {
                    miVideo.srcObject = stream;
                    miVideo.play();
                }
            })
            .catch((err) => {
                console.error('Error al acceder a la cámara:', err);
            });
    };
    const tomarFoto = () => {
        setShowCanvas(true);
        setTimeout(() => {
            const video = videoRef.current;
            const canva = canvaRef.current;

            if (video && canva) {
                const videoWidth = video.videoWidth; // Obtener ancho real del video
                const videoHeight = video.videoHeight; // Obtener alto real del video

                // Definir el área de recorte (ejemplo: 40% del tamaño total)
                const cropWidth = videoWidth * 0.4; // 40% del ancho total del video
                const cropHeight = videoHeight * 0.4; // 40% del alto total del video
                const cropX = (videoWidth - cropWidth) / 2; // Centrar en X
                const cropY = (videoHeight - cropHeight) / 2; // Centrar en Y

                // Ajustar el tamaño del canvas
                canva.width = cropWidth;
                canva.height = cropHeight;
                const context = canva.getContext('2d');

                if (context) {
                    // Capturar solo la región del video que se marcó visualmente
                    context.drawImage(
                        video,
                        cropX,
                        cropY,
                        cropWidth,
                        cropHeight, // Recorte desde el video
                        0,
                        0,
                        cropWidth,
                        cropHeight, // Dibujado en el canvas
                    );

                    const base64Image = canva.toDataURL('image/jpeg').split(',')[1];
                    cargarImagenYProcesarOCR(base64Image);
                    fetch(`data:image/jpeg;base64,${base64Image}`)
                        .then((res) => res.blob())
                        .then((blob) => {
                            const file = new File([blob], 'random.jpg', { type: 'image/jpeg' });
                            setData('photo', file);
                        });

                    if (stream) {
                        stream.getTracks().forEach((track) => track.stop());
                        setStream(null);
                    }

                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }

                    setShowVideo(false);
                    setShowCanvas(true);
                } else {
                    console.error('No se pudo obtener el contexto 2D del canvas.');
                }
            } else {
                console.error('El video o el canvas no están disponibles.');
            }
        }, 300);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buscador de INE" />
            <div className="flex flex-col gap-6">
                {showVideo && (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />

                        <div
                            className="rounded-lg"
                            style={{
                                position: 'absolute',
                                top: `${(cropY / videoHeight) * 100}%`,
                                left: `${(cropX / videoWidth) * 100}%`,
                                width: `${(cropWidth / videoWidth) * 100}%`,
                                height: `${(cropHeight / videoHeight) * 100}%`,
                                border: '5px solid red',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </div>
                )}
                {showCanvas && <canvas ref={canvaRef} style={{ width: '100%', height: '100%' }}></canvas>}
                {showVideo && <Button onClick={tomarFoto}>TOMAR FOTO</Button>}
                {!showVideo && <Button onClick={verCamara}>{nameBtn}</Button>}
            </div>
        </AppLayout>
    );
}
