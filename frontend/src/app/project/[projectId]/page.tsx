"use client";

import ProjectDetail from "@/app/_components/projectDetail";

// loader関数をエクスポートして、サーバーサイドでパラメータを取得し、ページコンポーネントにpropsとして渡します。
export async function loader({ params }) {
  console.log("param", params);
  return { props: { projectId: params.projectId } };
}

const Page = ({ projectId }) => {
  return (
    <div>
      <ProjectDetail projectId={projectId} />
    </div>
  );
};

export default Page;
