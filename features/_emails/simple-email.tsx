import {
  Body,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  content: string;
  email: string;
}

export function SimpleEmail({ email, content }: EmailTemplateProps) {
  const name = email.split("@")[0];

  return (
    <Html>
      <Preview>Message from {name}</Preview>
      <Tailwind>
        <Body className="max-w-150 font-sans text-black/80">
          <Section>
            <Text>{content}</Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
