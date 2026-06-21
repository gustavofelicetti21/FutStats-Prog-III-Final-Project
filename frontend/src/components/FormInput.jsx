function FormInput({ label, id, error, ...props }) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}

export default FormInput;
