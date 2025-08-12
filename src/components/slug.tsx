import React, { useState, useId } from 'react';

function Slug() {

  const [slug, setSlug] = useState('');
  const inputId = useId();

  function slugger(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    return null;
  }

  return (
    <div className="slug">
      <form>
        <label htmlFor={inputId}>Slug&nbsp;</label>
        <input type="text" id={inputId} name="slug" onChange={slugger} />

        <a href={`/p/${slug}`} className="button">
          p/{slug}
        </a>
      </form>
    </div>
  );
}

export default Slug;