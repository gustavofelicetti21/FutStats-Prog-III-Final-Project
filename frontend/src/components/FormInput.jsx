function FormInput({ label, id, error, hint, ...props }) {
  const descriptionIds = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <input
        aria-describedby={descriptionIds || undefined}
        aria-invalid={Boolean(error)}
        id={id}
        {...props}
      />
      {hint ? (
        <small className="field-hint" id={`${id}-hint`}>
          {hint}
        </small>
      ) : null}
      {error ? (
        <small className="field-error" id={`${id}-error`} role="alert">
          {error}
        </small>
      ) : null}
    </label>
  );
}

export default FormInput;
