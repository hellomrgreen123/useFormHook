import { useCallback, useRef, useState } from "react";

const useForm = ({ initialValues = {}, validate }) => {
  const initial = useRef(initialValues);
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { type, name } = e.target;
    const getValue = () => {
      if (type === "checkbox") {
        return e.target.checked;
      } else if (type === "select-multiple") {
        return Array.from(e.target.selectedOptions).map(
          (option) => option.value
        );
      } else if (type === "file") {
        for (let i = 0; i < e.target.files.length; i++) {
          e.target.files[i].url = URL.createObjectURL(e.target.files[i]);
        }
        return Array.from(e.target.files);
      }
      return e.target.value;
    };

    const value = getValue();
    setValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const initialize = useCallback((initialValues) => {
    if (!initialValues) {
      setValues(initial.current);
    } else {
      initial.current = initialValues;
      setValues(initialValues);
    }
  }, []);

  const errors = validate ? validate(values) : null;

  const handleSubmit = (onSubmit) => (e) => {
    setSubmitting(true);
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (!errors) {
      Promise.resolve(onSubmit(values, e)).finally(() => {
        const valueKeys = Object.keys(values);
        valueKeys.forEach((key) => {
          setTouched((prevTouched) => ({ ...prevTouched, [key]: false }));
        });
        setSubmitting(false);
      });
    } else {
      setSubmitting(false);
      const valueKeys = Object.keys(values);
      valueKeys.forEach((key) => {
        setTouched((prevTouched) => ({ ...prevTouched, [key]: true }));
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
    submitting,
    touched,
  };
};

export default useForm;
