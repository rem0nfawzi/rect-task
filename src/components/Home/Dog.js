import React from 'react';
import { Link } from 'react-router-dom';
const Dog = ({ dog }) => {
  return (
    <Link to={`/dog/${dog.ID}`} className='dog list-item'>
      <p>{dog.Name}</p>
      <p>{dog.Race}</p>
      <p>{dog.Color}</p>
      <p>{dog.Birthdate}</p>
      <p>{dog.IsDangerous ? 'Dangerous' : 'Not Dangerous'}</p>
    </Link>
  );
};

export default Dog;
