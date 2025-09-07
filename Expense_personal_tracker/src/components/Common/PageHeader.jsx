import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css';


const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  actions = [], 
  breadcrumbs = [],
  gradient = 'primary'
}) => {
  const gradientClasses = {
    primary: 'header-gradient-primary',
    success: 'header-gradient-success',
    danger: 'header-gradient-danger',
    warning: 'header-gradient-warning',
    info: 'header-gradient-info'
  };

  return (
    <div className={`page-header ${gradientClasses[gradient] || gradientClasses.primary}`}>
      <div className="header-container">
        <div className="header-row">
          <div className="header-col">
            <div className="header-content">
              <div className="header-left">
                {breadcrumbs.length > 0 && (
                  <nav className="header-breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                      <span key={index} className="breadcrumb-item">
                        {crumb.link ? (
                          <Link to={crumb.link} className="breadcrumb-link">
                            {crumb.icon && <i className={crumb.icon}></i>}
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="breadcrumb-current">
                            {crumb.icon && <i className={crumb.icon}></i>}
                            {crumb.label}
                          </span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                          <i className="fas fa-chevron-right breadcrumb-separator"></i>
                        )}
                      </span>
                    ))}
                  </nav>
                )}
                
                <div className="header-title-section">
                  <h1 className="header-title">
                    {icon && <i className={icon}></i>}
                    {title}
                  </h1>
                  {subtitle && <p className="header-subtitle">{subtitle}</p>}
                </div>
              </div>
              
              {actions.length > 0 && (
                <div className="header-actions">
                  {actions.map((action, index) => (
                    action.link ? (
                      <Link
                        key={index}
                        to={action.link}
                        className={`btn btn-${action.variant || 'primary'} header-action-btn ${action.className || ''}`}
                      >
                        {action.icon && <i className={action.icon}></i>}
                        {action.label}
                      </Link>
                    ) : (
                      <button
                        key={index}
                        className={`btn btn-${action.variant || 'primary'} header-action-btn ${action.className || ''}`}
                        onClick={action.onClick}
                      >
                        {action.icon && <i className={action.icon}></i>}
                        {action.label}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
