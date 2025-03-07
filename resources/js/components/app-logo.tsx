export default function AppLogo() {
    return (
        <>
            <div className="flex size-10 items-center justify-center rounded-md">
                <img src="/REDARA.jpg" alt="" />
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">REDARA</span>
            </div>
        </>
    );
}
