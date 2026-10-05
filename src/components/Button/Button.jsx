import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.css';

const Button = ({
  onClick,
  type = 'button',
  variant = 'default',
  className = '',
  children,
  ...rest
}) =>
  <button
    type={type}
    onClick={onClick}
    className={classNames('button', `button-${variant}`, className)}
    {...rest}
  >
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit']),
  variant: PropTypes.oneOf(['default', 'primary', 'icon']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
