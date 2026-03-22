const NoticeHeroGraphic = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[#E9EEF8] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FAFF_55%,#F5F7FB_100%)] px-6 py-6 md:px-8 md:py-7">
      <div className="absolute top-0 -right-10 h-28 w-28 rounded-full bg-[#E8EEFF] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#EEF2FF] blur-2xl" />

      <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.18em] text-[#5B74F7]">
            NOTICE
          </span>
          <strong className="text-[1.45rem] leading-[1.45] font-semibold tracking-[-0.03em] text-[#202124] md:text-[1.7rem]">
            핵심 내용을 더 빠르게 읽을 수 있도록
            <br />
            단정한 정보형 상세 화면으로 구성했습니다.
          </strong>
          <p className="max-w-[36rem] text-[1rem] leading-[1.8] text-[#7D8592] md:text-[1.08rem]">
            제목, 날짜, 본문, 이전글과 다음글 흐름을 한 번에 확인할 수 있도록
            정돈된 레이아웃을 제공합니다.
          </p>
        </div>

        <div className="justify-self-end">
          <div className="relative h-[8.5rem] w-[13rem] rounded-[1.4rem] border border-white bg-white/90 p-4 shadow-[0_18px_35px_rgba(91,116,247,0.08)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2.5 w-16 rounded-full bg-[#5B74F7]" />
              <div className="rounded-full bg-[#EEF3FF] px-2 py-1 text-[0.72rem] font-semibold text-[#5B74F7]">
                DETAIL
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-2.5 w-full rounded-full bg-[#202124]" />
              <div className="h-2.5 w-[78%] rounded-full bg-[#C8CED8]" />
              <div className="h-2.5 w-[86%] rounded-full bg-[#E4E8EF]" />
            </div>
            <div className="absolute -right-4 -bottom-4 h-14 w-14 rounded-[1.1rem] bg-[#5B74F7] shadow-[0_16px_30px_rgba(91,116,247,0.22)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeHeroGraphic;
