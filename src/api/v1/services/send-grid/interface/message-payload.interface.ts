interface Content {
  type: string;
  value: string;
}

interface LogoAttatchment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
  content_id: string;
}

export interface MessagePayload {
  from: string;
  to: string;
  subject: string;
  attachments: LogoAttatchment[];
  content?: Content[];
}
