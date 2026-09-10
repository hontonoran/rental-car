"use client";

import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import toast from "react-hot-toast";
import { LuCircleAlert } from "react-icons/lu";
import * as Yup from "yup";
import { createBookingRequest } from "@/lib/api";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  carId: string;
}

interface BookingFormValues {
  name: string;
  email: string;
  comment: string;
}

const initialValues: BookingFormValues = {
  name: "",
  email: "",
  comment: "",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Please enter your name.")
    .max(40, "Name must be 40 characters or less.")
    .matches(/^[\p{L}][\p{L}\s'’-]*$/u, "Please enter your name.")
    .required("Please enter your name."),
  email: Yup.string()
    .trim()
    .email("Please enter your email.")
    .required("Please enter your email."),
  comment: Yup.string()
    .trim()
    .max(300, "Comment must be 300 characters or less.")
    .required("Comment is required."),
});

const FIELDS = [
  { name: "name", label: "Name*", type: "text", autoComplete: "name" },
  { name: "email", label: "Email*", type: "email", autoComplete: "email" },
  { name: "comment", label: "Comment", type: "textarea" },
] as const;

export default function BookingForm({ carId }: BookingFormProps) {
  const handleSubmit = async (
    values: BookingFormValues,
    helpers: FormikHelpers<BookingFormValues>,
  ) => {
    try {
      const { message } = await createBookingRequest(carId, {
        name: values.name.trim(),
        email: values.email.trim(),
        comment: values.comment.trim(),
      });

      toast.success(message || "Your car is booked. We will contact you soon.");
      helpers.resetForm();
    } catch {
      toast.error("We could not send your request. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}

      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ errors, isSubmitting, submitCount, values }) => (
        <Form className={styles.form} noValidate>
          <div className={styles.header}>
            <h2 className={styles.title}>Book your car now</h2>
            <p className={styles.subtitle}>
              Stay connected! We are always ready to help you.
            </p>
          </div>

          <div className={styles.fields}>
            {FIELDS.map((field) => {
              const isInvalid = Boolean(submitCount > 0 && errors[field.name]);
              const hasValue = values[field.name].length > 0;
              const isTextarea = field.type === "textarea";

              return (
                <div className={styles.field} key={field.name}>
                  <label
                    className={`${styles.control} ${
                      isTextarea ? styles.controlTextarea : ""
                    } ${isInvalid ? styles.controlInvalid : ""}`}
                  >
                    {hasValue && (
                      <span className={styles.floatingLabel}>
                        {field.label}
                      </span>
                    )}
                    <span className="visually-hidden">{field.label}</span>
                    <Field
                      className={styles.input}
                      as={isTextarea ? "textarea" : undefined}
                      type={isTextarea ? undefined : field.type}
                      name={field.name}
                      placeholder={field.label}
                      autoComplete={
                        "autoComplete" in field ? field.autoComplete : undefined
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <LuCircleAlert
                        aria-hidden="true"
                        className={styles.alertIcon}
                      />
                    )}
                  </label>
                  {isInvalid && (
                    <span className={styles.error} role="alert">
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
