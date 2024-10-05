import Container from '../container';
import HomeSearch from './home-search';

export async function HomeHero() {
  // const categoryList = await sanityFetch<CategoryListQueryResult>({
  //   query: categoryListQuery
  // });
  // const tagList = await sanityFetch<TagListQueryResult>({
  //   query: tagListQuery
  // });

  // // convert categoryList/tagList to CategoryFilterItem[]/TagFilterItem[]
  // const categories = categoryList.map((category) => ({
  //   slug: category.slug.current,
  //   name: category.name,
  // }));
  // const tags = tagList.map((tag) => ({
  //   slug: tag.slug.current,
  //   name: tag.name,
  // }));

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:flex md:flex-col mt-8">
        <div className='w-full'>
            <HomeSearch />
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col mt-8">
        <div className='w-full'>
            <HomeSearch />
        </div>
      </div>
    </div>
  );
}
