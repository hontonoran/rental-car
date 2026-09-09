"use client";

import DatePicker from "react-datepicker";
import type { FieldProps, FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { createBookingRequest } from "@/lib/api";
import type { BookingRequestPayload } from "@/types/car";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  carId: string;
}

interface BookingFormValues {
  name: string;
  email: string;
  bookingDate: Date | null;
  comment: string;
}

const initialValues: BookingFormValues = {
  name: "",
  email: "",
  bookingDate: null,
  comment: "",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be 40 characters or less")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  bookingDate: Yup.date()
    .nullable()
    .required("Booking date is required"),
  comment: Yup.string()
    .trim()
    .max(300, "Comment must be 300 characters or less"),
});

export default function BookingForm({ carId }: BookingFormProps) {
  async function handleSubmit(
    values: BookingFormValues,
    helpers: FormikHelpers<BookingFormValues>,
  ) {
    const payload: BookingRequestPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      bookingDate: values.bookingDate?.toISOString(),
      comment: values.comment.trim() || undefined,
    };

    try {
      await createBookingRequest(carId, payload);
      toast.success("Car rented successfully!");
      helpers.resetForm();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, isSubmitting, touched }) => (
        <Form className={styles.form} noValidate>
          <h2 className={styles.title}>Book your car now</h2>
          <p className={styles.text}>
            Stay connected! We are always ready to help you.
          </p>

          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <Field
              className={styles.input}
              type="text"
              name="name"
              placeholder="Name*"
              autoComplete="name"
              aria-invalid={touched.name && Boolean(errors.name)}
            />
            {touched.name && errors.name ? (
              <span className={styles.error}>{errors.name}</span>
            ) : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <Field
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email*"
              autoComplete="email"
              aria-invalid={touched.email && Boolean(errors.email)}
            />
            {touched.email && errors.email ? (
              <span className={styles.error}>{errors.email}</span>
            ) : null}
          </label>

          <Field name="bookingDate">
            {({ field, form }: FieldProps<Date | null, BookingFormValues>) => (
              <label className={styles.field}>
                <span className={styles.label}>Booking date</span>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => {
                    form.setFieldValue(field.name, date);
                    form.setFieldTouched(field.name, true, false);
                  }}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  placeholderText="Booking date"
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                  className={styles.input}
                  wrapperClassName={styles.datePickerWrapper}
                  calendarClassName={styles.calendar}
                  popperClassName={styles.popper}
                  ariaInvalid={
                    touched.bookingDate && errors.bookingDate
                      ? "true"
                      : undefined
                  }
                />
                {touched.bookingDate && errors.bookingDate ? (
                  <span className={styles.error}>{errors.bookingDate}</span>
                ) : null}
              </label>
            )}
          </Field>

          <label className={styles.field}>
            <span className={styles.label}>Comment</span>
            <Field
              as="textarea"
              className={styles.textarea}
              name="comment"
              placeholder="Comment"
              aria-invalid={touched.comment && Boolean(errors.comment)}
            />
            {touched.comment && errors.comment ? (
              <span className={styles.error}>{errors.comment}</span>
            ) : null}
          </label>

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
