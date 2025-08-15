import React from 'react';
import './form-default.css';

interface FormDefaultProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const FormDefault: React.FC<FormDefaultProps> = ({ onSubmit, children, title, className }) => {
  return (
    <form className={`form-wrapper ${className || ''}`} onSubmit={onSubmit}>
      {title && <h2 className="form-title">{title}</h2>}
      {children}
    </form>
  );
};

export default FormDefault;
