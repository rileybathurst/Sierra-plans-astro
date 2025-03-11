import React, { useState } from 'react';

function Slug() {
  // TODO: make this pretty

  const [slug, setSlug] = useState('');

  function slugger(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    return null;
  }

  return (
    <div className="slug">
      <form>

        <label htmlFor="slug">Slug&nbsp;</label>
        <input type="text" id="slug" name="slug" onChange={slugger} />

        <a href={`/p/${slug}`} className="button">
          p/{slug}
        </a>
      </form>
    </div>
  );
}

export default Slug;