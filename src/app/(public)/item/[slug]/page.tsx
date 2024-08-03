
type Props = {
  params: { slug: string };
};

export default async function ItemPage({ params }: Props) {
  const slug = params.slug;

  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
}
