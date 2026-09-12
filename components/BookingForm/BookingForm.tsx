"use client";

import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { LuCircleAlert } from "react-icons/lu";
import * as Yup from "yup";
import { createBookingRequest } from "@/lib/api";
import { formatDateRange, startOfToday } from "@/lib/format";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  carId: string;
}

interface BookingFormValues {
  name: string;
  email: string;
  pickupDate: Date | null;
  returnDate: Date | null;
  comment: string;
}

const initialValues: BookingFormValues = {
  name: "",
  email: "",
  pickupDate: null,
  returnDate: null,
  comment: "",
};

const FIELDS = [
  { name: "name", label: "Name*", type: "text", autoComplete: "name" },
  { name: "email", label: "Email*", type: "email", autoComplete: "email" },
] as const;

export default function BookingForm({ carId }: BookingFormProps) {
  const today = startOfToday();

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
    pickupDate: Yup.date()
      .nullable()
      .min(today, "Pick-up date can't be in the past.")
      .required("Please choose a pick-up date."),
    returnDate: Yup.date()
      .nullable()
      .min(Yup.ref("pickupDate"), "Return date must be after pick-up.")
      .required("Please choose a return date."),
    comment: Yup.string()
      .trim()
      .max(300, "Comment must be 300 characters or less."),
  });

  const handleSubmit = async (
    values: BookingFormValues,
    helpers: FormikHelpers<BookingFormValues>,
  ) => {
    const comment = [
      `Rental period: ${formatDateRange(values.pickupDate!, values.returnDate!)}`,
      values.comment.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const { message } = await createBookingRequest(carId, {
        name: values.name.trim(),
        email: values.email.trim(),
        comment,
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
      {({ errors, isSubmitting, setFieldValue, submitCount, values }) => {
        const isInvalid = (name: keyof BookingFormValues) =>
          Boolean(submitCount > 0 && errors[name]);

        return (
          <Form className={styles.form} noValidate>
            <div className={styles.header}>
              <h2 className={styles.title}>Book your car now</h2>
              <p className={styles.subtitle}>
                Stay connected! We are always ready to help you.
              </p>
            </div>

            <div className={styles.fields}>
              {FIELDS.map((field) => {
                const invalid = isInvalid(field.name);
                const hasValue = values[field.name].length > 0;

                return (
                  <div className={styles.field} key={field.name}>
                    <label
                      className={`${styles.control} ${
                        invalid ? styles.controlInvalid : ""
                      }`}
                    >
                      {hasValue && (
                        <span className={styles.floatingLabel}>
                          {field.label}
                        </span>
                      )}
                      <span className="visually-hidden">{field.label}</span>
                      <Field
                        className={styles.input}
                        type={field.type}
                        name={field.name}
                        placeholder={field.label}
                        autoComplete={field.autoComplete}
                        aria-invalid={invalid}
                      />
                      {invalid && (
                        <LuCircleAlert
                          aria-hidden="true"
                          className={styles.alertIcon}
                        />
                      )}
                    </label>
                    {invalid && (
                      <span className={styles.error} role="alert">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                );
              })}

              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label
                    className={`${styles.control} ${
                      isInvalid("pickupDate") ? styles.controlInvalid : ""
                    }`}
                  >
                    {values.pickupDate && (
                      <span className={styles.floatingLabel}>
                        Pick-up date*
                      </span>
                    )}
                    <span className="visually-hidden">Pick-up date</span>
                    <DatePicker
                      selected={values.pickupDate}
                      onChange={(date: Date | null) => {
                        setFieldValue("pickupDate", date);

                        if (
                          date &&
                          values.returnDate &&
                          values.returnDate < date
                        ) {
                          setFieldValue("returnDate", null);
                        }
                      }}
                      minDate={today}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Pick-up date*"
                      wrapperClassName={styles.datePickerWrapper}
                      customInput={<input className={styles.input} readOnly />}
                    />
                    {isInvalid("pickupDate") && (
                      <LuCircleAlert
                        aria-hidden="true"
                        className={styles.alertIcon}
                      />
                    )}
                  </label>
                  {isInvalid("pickupDate") && (
                    <span className={styles.error} role="alert">
                      {errors.pickupDate as string}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label
                    className={`${styles.control} ${
                      isInvalid("returnDate") ? styles.controlInvalid : ""
                    }`}
                  >
                    {values.returnDate && (
                      <span className={styles.floatingLabel}>
                        Return date*
                      </span>
                    )}
                    <span className="visually-hidden">Return date</span>
                    <DatePicker
                      selected={values.returnDate}
                      onChange={(date: Date | null) =>
                        setFieldValue("returnDate", date)
                      }
                      minDate={values.pickupDate ?? today}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Return date*"
                      wrapperClassName={styles.datePickerWrapper}
                      customInput={<input className={styles.input} readOnly />}
                    />
                    {isInvalid("returnDate") && (
                      <LuCircleAlert
                        aria-hidden="true"
                        className={styles.alertIcon}
                      />
                    )}
                  </label>
                  {isInvalid("returnDate") && (
                    <span className={styles.error} role="alert">
                      {errors.returnDate as string}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label
                  className={`${styles.control} ${styles.controlTextarea} ${
                    isInvalid("comment") ? styles.controlInvalid : ""
                  }`}
                >
                  {values.comment.length > 0 && (
                    <span className={styles.floatingLabel}>Comment</span>
                  )}
                  <span className="visually-hidden">Comment</span>
                  <Field
                    as="textarea"
                    className={styles.input}
                    name="comment"
                    placeholder="Comment"
                    aria-invalid={isInvalid("comment")}
                  />
                  {isInvalid("comment") && (
                    <LuCircleAlert
                      aria-hidden="true"
                      className={styles.alertIcon}
                    />
                  )}
                </label>
                {isInvalid("comment") && (
                  <span className={styles.error} role="alert">
                    {errors.comment}
                  </span>
                )}
              </div>
            </div>

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send"}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
