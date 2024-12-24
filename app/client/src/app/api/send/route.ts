import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@chirag-chhajed.me",
      to: ["chirag18@duck.com", "chhajedchirag18@gmail.com"],
      subject: "Hello world",
      html: "<strong>It works!</strong>",
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
