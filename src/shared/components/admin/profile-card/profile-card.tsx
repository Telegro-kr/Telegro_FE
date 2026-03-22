import Icon from '@components/common/icon';

type AdminProfileCardProps = {
  onMove?: () => void;
};

const AdminProfileCard = ({ onMove }: AdminProfileCardProps) => {
  return (
    <div className="flex w-full items-center gap-[1.3rem]">
      <img
        src="/admin-profile.svg"
        alt="관리자 프로필"
        className="h-[10rem] w-[10rem] shrink-0 object-cover"
      />

      <div className="w-[35rem] flex-col items-start gap-[0.3rem]">
        <span className="text-[3rem] font-semibold text-gray-900">
          관리자 페이지
        </span>

        <div className="flex-row-between gap-[2rem]">
          <p className="flex flex-col justify-center">
            <span className="text-[2.2rem] font-semibold text-gray-700">
              일반 페이지로 이동하기
            </span>
          </p>

          <button
            type="button"
            onClick={onMove}
            aria-label="일반 페이지로 이동"
            className="flex-row-center h-[4.5rem] w-[4.5rem] cursor-pointer rounded-full bg-[#FEFFD5] hover:bg-[#fdfebe]"
          >
            <Icon name="admin-arrow" size={4.5} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;
