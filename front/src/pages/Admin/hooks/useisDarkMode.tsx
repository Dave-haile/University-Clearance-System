import { useEffect, useState } from "react";

export const useIsDarkMode = () => {
    const [isDark, setIsDark] = useState<boolean>(false);
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        setIsDark(document.documentElement.classList.contains('dark'));
        return () => observer.disconnect();
    }, []);
    return isDark;
};