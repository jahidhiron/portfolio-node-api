export interface ContentSecurityPolicy {
  directives: {
    defaultSrc: string[];
    styleSrc: string[];
    scriptSrc: string[];
    fontSrc: string[];
  };
}
