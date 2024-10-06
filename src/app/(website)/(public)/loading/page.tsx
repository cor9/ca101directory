import Container from "@/components/container";
import Loading from "../../(protected)/(submit)/plan/[id]/loading";
// import Loading from "../../(protected)/(submit)/publish/[id]/loading";
// import Loading from "../../(protected)/(submit)/submit/loading";
// import Loading from "../../(protected)/dashboard/loading";
// import Loading from "../../(protected)/edit/[id]/loading";
// import Loading from "../../(protected)/settings/loading";
// import Loading from "../category/loading";
// import Loading from "../item/[slug]/loading";
// import Loading from "../blog/(blog)/loading";
// import Loading from "../pricing/loading";
// import Loading from "../blog/[slug]/loading";

/**
 * This is a loading page for testing purposes.
 */
export default function LoadingDemo() {
  return (
    <Container className="mt-8 pb-16">
      <Loading />
    </Container>
  );
}