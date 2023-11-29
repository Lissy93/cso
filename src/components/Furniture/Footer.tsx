import { Component } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledFooter = styled('footer')`
  background: var(--background-lighter);
  text-align: center;
  padding: 0.2rem 0;
  opacity: 0.8;
  a {
    color: var(--primary);
    font-weight: bold;
    text-decoration: none;
    margin: 0 2px;
    padding: 0 2px;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: var(--foreground);
      background: var(--primary-darker);
    }
  }
`;


const Footer: Component = () => {

  const footerContent = {
    appName: 'Snack Champion',
    githubUrl: 'https://github.com/lissy93/cso',
    developer: 'Alicia Sykes',
    developerUrl: 'https://aliciasykes.com',
    license: 'MIT',
    licenseUrl: 'https://github.com/lissy93/cso/blob/main/LICENSE',
    licenseDate: new Date().getFullYear(),
  };

  return (
    <StyledFooter>
      <a href={footerContent.githubUrl}>{footerContent.appName}</a> is
      licensed under <a href={footerContent.licenseUrl}>{footerContent.license}</a> ©
      <a href={footerContent.developerUrl}>{footerContent.developer}</a> {footerContent.licenseDate} |
      Source code available on <a href={footerContent.githubUrl}>GitHub</a>.
    </StyledFooter>
  );
};

export default Footer;
