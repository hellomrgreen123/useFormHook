import React, { Fragment, useState, useEffect } from "react";

import useForm from "../store/hooks/useForms";
const example = () => {
  const initialValues = {
    id: "",
    title: "",
    price: "",
    image: [],
    quantity: "",
  };
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
  } = useForm({ initialValues });

  const onSubmit = async (e) => {
    console.log(values)
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <input
            type="file"
            name="image"
            multiple
            onChange={handleChange}
          />
          <input
            onBlur={handleBlur}
            placeholder="title"
            name="title"
            onChange={handleChange}
            value={values.title}
            
          />
          <input
            onBlur={handleBlur}
            placeholder="quantity"
            name="quantity"
            onChange={handleChange}
            value={values.quantity}
           
          />
          <input
            onBlur={handleBlur}
            placeholder="price"
            name="price"
            onChange={handleChange}
            value={values.price}
          />
        </div>
        <input
          type="submit"
          value="Upload"
        />
      </form>
      {values.image && (
        <div>
          {values.image.map((img, i) => {
            return (
              <img
                className="preview"
                src={img.url}
                alt={"image-" + i}
                style={{width: "30vw"}}
                key={i}
              />
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default example;
