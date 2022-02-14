import { useCallback, useRef, useState } from "react";

const useForm = (initialValues = {}, validate: any = null, ...args: any) => {
    const initial = useRef<any>(initialValues);
    const [values, setValues] = useState<any>(initialValues);
    const [touched, setTouched] = useState<any>({});
    const [submitting, setSubmitting] = useState<boolean>(false);


    const handleChange = (e: any) => {
        const { type, name } = e.target;
        e.preventDefault()
        const getValue = () => {
            if (type === "checkbox") {
                return e.target.checked;
            } else if (type === "select-multiple") {
                return Array.from(e.target.selectedOptions).map(
                    (option: any) => option.value
                );
            } else if (type === "file") {
                for (let i = 0; i < e.target.files.length; i++) {
                    e.target.files[i].url = URL.createObjectURL(e.target.files[i]);
                }
                return Array.from(e.target.files);
            } else if (type === "number") {
                if (isNaN(e.target.value)) {
                    e.target.value = 0
                }
                e.target.value = parseInt(e.target.value, 10)
            }
            return e.target.value;
        };

        const value = getValue();
        setValues((prevValues: any) => {
            return { ...prevValues, [name]: value };

        });
    }

    const handleBlur = (e: any) => {
        const { name, type } = e.target;
        if (type === "number") {
            const integer = parseInt(e.target.value, 10)
            setValues((prevValues: any) => {
                return { ...prevValues, [name]: integer };
            })
        }
        setTouched((prevTouched: any) => ({ ...prevTouched, [name]: true }));
    };

    const initialize = useCallback((initialValues: any) => {
        if (!initialValues) {
            setValues(initial.current);
        } else {
            initial.current = initialValues;
            setValues(initialValues);
        }
    }, []);


    const errors = validate ? validate(values, ...args) : null;
    const valid = errors == null ?  errors == null : Object.keys(errors).length === 0;

    const handleSubmit = (onSubmit: any) => (e: any) => {
        setSubmitting(true);
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        if (valid) {

            Promise.resolve(onSubmit(values, e)).finally(() => {
                const valueKeys = Object.keys(values);
                valueKeys.forEach((key) => {
                    setTouched((prevTouched: any) => ({ ...prevTouched, [key]: false }));
                });
                setSubmitting(false);
            });
        } else {
            setSubmitting(false);
            const valueKeys = Object.keys(values);
            valueKeys.forEach((key) => {
                setTouched((prevTouched: any) => ({ ...prevTouched, [key]: true }));
            });
        }
    };

    return {
        values,
        setValues,
        handleChange,
        handleBlur,
        handleSubmit,
        initialize,
        errors,
        valid,
        submitting,
        touched,
    };
};

export default useForm;
