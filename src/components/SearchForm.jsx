import "../styles/search-form.css";

function SearchForm({ formInput, setFormInput, onHandleSubmit }) {
  return (
    <form onSubmit={onHandleSubmit}>
      <div className='input-container'>
        <label htmlFor='city'>City name</label>
        <input
          type='text'
          id='city'
          value={formInput}
          placeholder='Enter City name'
          onChange={(e) => setFormInput(e.target.value)}
        />
      </div>
      <button type='submit' className='submit-btn'>
        Submit
      </button>
    </form>
  );
}

export default SearchForm;
