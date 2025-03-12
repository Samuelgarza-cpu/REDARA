import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Textarea } from '@headlessui/react';
import axios from 'axios';
import Compressor from 'compressorjs';
type RegisterForm = {
    name: string;
    address: string;
    voter_code: string;
    curp: string;
    registration_year: string;
    date_of_birth: string;
    section: string;
    validity: string;
    id_rol: number;
    id_user_register: number;
    email: string;
    password: string;
    password_confirmation: string;
    photo: File | null;
};
type Role = {
    id: number;
    role_name: string;
};

interface RolePropos {
    roles: Role[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const MB = 1048576;

const videoWidth = esMovil ? 720 : 1080;
const videoHeight = esMovil ? 1080 : 720;

// Coordenadas y tamaño del recorte en proporción a la resolución del video
const cropWidth = videoWidth * 0.5; // 20% del ancho total
const cropHeight = videoHeight * 0.5; // 15% del alto total
const cropX = videoWidth * 0.5; // 10% desde la izquierda
const cropY = videoHeight * 0.5; // 7% desde la parte superior

export default function Register({ roles = [] }: RolePropos) {
    const [fileSizeExceeded, setFileSizeExceeded] = useState(3 * MB);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const { auth } = usePage<SharedData>().props;
    const [showModal, setShowModal] = useState(true);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showVideo, setShowVideo] = useState(true);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvaRef = useRef<HTMLCanvasElement | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        address: '',
        voter_code: '',
        curp: '',
        registration_year: '',
        date_of_birth: '',
        section: '',
        validity: '',
        id_rol: roles[0]['id'], //este vendra de la tabla usuario-roles-registra
        id_user_register: 1,
        email: '',
        password: '123456789',
        password_confirmation: '123456789',
        photo: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => {
                reset(
                    'name',
                    'address',
                    'voter_code',
                    'curp',
                    'registration_year',
                    'date_of_birth',
                    'section',
                    'validity',
                    'id_rol',
                    'id_user_register',
                    'email',
                    'password',
                    'password_confirmation',
                    'photo',
                );

                // ✅ Limpiar el input file manualmente
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleSelectPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const imageCompress = async (file: File | Blob | any): Promise<File> => {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.1,
                convertSize: 1, // 3MB
                maxWidth: 900,
                maxHeight: 800,
                success(result: any) {
                    // Convertir el Blob a un File
                    const compressedFile = new File([result], file.name, {
                        type: result.type,
                        lastModified: Date.now(),
                    });

                    resolve(compressedFile); // Resolver la promesa con el archivo comprimido
                },
                error(err: any) {
                    reject(err); // Rechazar la promesa si ocurre un error
                },
            });
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            let newFile = file;
            const fileCompressed = await imageCompress(file);
            newFile = fileCompressed;

            setData('photo', file);
            setShowVideo(false);
            setShowModal(false);

            const reader = new FileReader();
            reader.readAsDataURL(newFile);
            reader.onload = async () => {
                const base64Image: string = reader.result?.toString().split(',')[1] || '';
                cargarImagenYProcesarOCR(base64Image);
            };
        }
    };

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

            //ENCONTRAR INDICES DE PARTIDA
            const IndexNombre = informacionINE.findIndex((OCR: any) => OCR.description === 'NOMBRE');
            const IndexDomicilio = informacionINE.findIndex((OCR: any) => OCR.description === 'DOMICILIO');
            const IndexClaveElector = informacionINE.findIndex((OCR: any) => OCR.description === 'ELECTOR'); //31
            const IndexCurp = informacionINE.findIndex((OCR: any) => OCR.description === 'CURP'); //33
            const IndexAnoRegistro = informacionINE.findIndex((OCR: any) => OCR.description === 'REGISTRO'); //37 Y 38
            const IndexFechaNacimiento = informacionINE.findIndex((OCR: any) => OCR.description === 'NACIMIENTO');

            const elementosEntre = informacionINE.slice(IndexNombre + 1, IndexDomicilio); // Esto extrae la informacion entre dos elementos de un array
            const nameLarge = elementosEntre.map((obj: any) => obj.description).join(' ');
            const elementosEntre2 = informacionINE.slice(IndexDomicilio + 1, IndexClaveElector - 2);
            const addressOCR = elementosEntre2.map((obj: any) => obj.description).join(' ');
            //DESPUES HICE ESTO, AL RATO LO JUNTO
            const SearchArrayIndex = (data: [], descripcion: string) => {
                return data.findIndex((OCR: any) => OCR.description === descripcion);
            };

            //CREAR VARIABLES DE CONCATENACION

            const voter_codeOCR = informacionINE[IndexClaveElector + 1]['description'];
            const curpOCR = informacionINE[IndexCurp + 1]['description'];
            const registration_yearOCR =
                informacionINE[IndexAnoRegistro + 1]['description'] + ' ' + informacionINE[IndexAnoRegistro + 2]['description'];
            const date_of_birthOCR = informacionINE[IndexFechaNacimiento + 1]['description'];

            const sectionOCR = informacionINE[SearchArrayIndex(informacionINE, 'SECCIÓN') + 1]['description'];
            let validityOCR = informacionINE[SearchArrayIndex(informacionINE, 'VIGENCIA') + 1]['description'];
            if (validityOCR.includes('-')) validityOCR = validityOCR.split('-').reverse()[0];

            setData('name', nameLarge);
            setData('address', addressOCR);
            setData('voter_code', voter_codeOCR);
            setData('curp', curpOCR);
            setData('registration_year', registration_yearOCR);
            setData('date_of_birth', date_of_birthOCR);
            setData('section', sectionOCR);
            setData('validity', validityOCR);
        } catch (error) {
            console.error('Error al realizar OCR con Google Vision:', error);
        }
    };

    const verCamara = () => {
        // Configurar restricciones de la cámara
        const constraints = {
            video: esMovil
                ? { width: videoWidth, height: videoHeight, facingMode: { exact: 'environment' } } // Cámara trasera en móviles
                : { width: videoWidth, height: videoHeight }, // Cámara por defecto en escritorio
        };

        setShowModal(false);
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
    // const tomarFoto = () => {
    //     setShowCanvas(true);
    //     setTimeout(() => {
    //         const w = 420;
    //         const h = w / (16 / 9);

    //         const video = videoRef.current;
    //         const canva = canvaRef.current;

    //         if (video && canva) {
    //             canva.width = w;
    //             canva.height = h;
    //             const context = canva.getContext('2d');

    //             if (context) {
    //                 context.drawImage(video, 0, 0, w, h);
    //                 const base64Image = canva.toDataURL('image/jpeg').split(',')[1];
    //                 cargarImagenYProcesarOCR(base64Image);
    //                 fetch(`data:image/jpeg;base64,${base64Image}`)
    //                     .then((res) => res.blob())
    //                     .then((blob) => {
    //                         const file = new File([blob], 'random.jpg', { type: 'image/jpeg' });
    //                         setData('photo', file);
    //                     });

    //                 if (stream) {
    //                     stream.getTracks().forEach((track) => track.stop());
    //                     setStream(null);
    //                 }

    //                 if (videoRef.current) {
    //                     videoRef.current.srcObject = null;
    //                 }

    //                 setShowVideo(false);
    //                 setShowCanvas(false);
    //             } else {
    //                 console.error('No se pudo obtener el contexto 2D del canvas.');
    //             }
    //         } else {
    //             console.error('El video o el canvas no están disponibles.');
    //         }
    //     }, 300);
    // };

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
                    setShowCanvas(false);
                } else {
                    console.error('No se pudo obtener el contexto 2D del canvas.');
                }
            } else {
                console.error('El video o el canvas no están disponibles.');
            }
        }, 300);
    };

    const cerrarFoto = () => {
        const f = canvaRef.current;
        if (f) {
            const context = f.getContext('2d');
            if (context) {
                context.clearRect(0, 0, f.width, f.height);
            } else {
                console.error('No se pudo obtener el contexto 2D del canvas.');
            }
        } else {
            console.error('El canvas no está disponible.');
        }
        if (stream) {
            stream.getTracks().forEach((track) => track.stop()); // Detiene la cámara
            setStream(null); // Limpia el estado
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null; // Limpia el video
        }
    };

    return (
        <AuthLayout title="Registar Usuario" description="" showImage={false}>
            <Head title="Register" />

            {showModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="rounded-lg bg-white p-6 text-center shadow-lg">
                        <h2 className="mb-4 text-lg font-bold">Seleccionar Foto</h2>
                        <div className="flex gap-4">
                            <Button onClick={handleSelectPhoto}>Galería</Button>
                            <Button onClick={verCamara}>Tomar Foto</Button>
                        </div>
                    </div>
                </div>
            )}

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
                {showVideo && <Button onClick={tomarFoto}>Tomar Foto</Button>}
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {data.photo && (
                    <div className="text-center">
                        <Link href="/registro" prefetch>
                            <img src={URL.createObjectURL(data.photo)} alt="Foto seleccionada" className="fill mx-auto rounded-lg object-fill" />
                        </Link>

                        <InputError message={errors.photo} className="mt-2" />
                    </div>
                )}
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            // placeholder="Nombre Completo"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea
                            id="address"
                            required
                            tabIndex={1}
                            autoComplete="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Clave de Elector</Label>
                        <Input
                            id="voter_code"
                            type="text"
                            tabIndex={1}
                            autoComplete="voter_code"
                            value={data.voter_code}
                            onChange={(e) => setData('voter_code', e.target.value)}
                            disabled={processing}
                            // placeholder="Full voter_code"
                        />
                        <InputError message={errors.voter_code} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">CURP</Label>
                        <Input
                            id="curp"
                            type="text"
                            tabIndex={1}
                            autoComplete="curp"
                            value={data.curp}
                            onChange={(e) => setData('curp', e.target.value)}
                            disabled={processing}
                            // placeholder="Full curp"
                        />
                        <InputError message={errors.curp} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Año de Registro</Label>
                        <Input
                            id="registration_year"
                            type="text"
                            tabIndex={1}
                            autoComplete="registration_year"
                            value={data.registration_year}
                            onChange={(e) => setData('registration_year', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.registration_year} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Fecha de Nacimiento</Label>
                        <Input
                            id="date_of_birth"
                            type="text"
                            tabIndex={1}
                            autoComplete="date_of_birth"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.date_of_birth} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Sección</Label>
                        <Input
                            id="section"
                            type="text"
                            tabIndex={1}
                            autoComplete="section"
                            value={data.section}
                            onChange={(e) => setData('section', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.section} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Vigencia</Label>
                        <Input
                            id="validity"
                            type="text"
                            tabIndex={1}
                            autoComplete="validity"
                            value={data.validity}
                            onChange={(e) => setData('validity', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.validity} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="id_rol">Rol</Label>
                        <select
                            id="id_rol"
                            name="id_rol"
                            required
                            tabIndex={2}
                            value={data.id_rol}
                            onChange={(e) => setData('id_rol', parseInt(e.target.value))}
                            disabled={processing}
                            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>
                                Selecciona un rol
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.id_rol} className="mt-2" />
                    </div>
                    {auth.user.id_rol == 1 ? (
                        <>
                            {' '}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </>
                    ) : null}

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        GUARDAR
                    </Button>
                </div>

                {/* <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Accesar
                    </TextLink>
                </div> */}
            </form>
        </AuthLayout>
    );
}
