import BoardingPass from "../_components/BoardingPass"
export default async function BoardingPassPage({ params }) {
  const slug = (await params).slug
  console.log(slug)
  return (
    <BoardingPass />
  )
}