import React, { useState, useId } from 'react';

function Jobber() {

  const [jobber, setJobber] = useState('');
  const inputId = useId();

  function jobberer(e: React.ChangeEvent<HTMLInputElement>) {
    setJobber(e.target.value);
    return null;
  }

  return (
    <div className="jobber">
      <form>
        <label htmlFor={inputId}>Jobber&nbsp;</label>
        <input type="text" id={inputId} name="jobber" onChange={jobberer} />

        <a href={`/p/${jobber}`} className="button">
          p/{jobber}
        </a>
      </form>
    </div>
  );
}

export default Jobber;