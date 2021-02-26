import { useCallback, useRef, useState } from "react";
import { isEmpty } from "./utils";

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
        return Array.from(e.target.selectedOptions).map((o) => o.value);
      }
      return e.target.value;
    };

    const value = getValue();
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
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

  const errors = validate ? validate(values) : {};
  const valid = isEmpty(errors);

  const handleSubmit = (onSubmit) => (e) => {
    setSubmitting(true);
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (valid) {
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

  const dirty = !!Object.keys(initial.current).find(
    (key) => initial.current[key] !== values[key]
  );

  return {
    values,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    initialize,
    errors,
    submitting,
    valid,
    dirty,
    touched,
  };
};

export default useForm;
