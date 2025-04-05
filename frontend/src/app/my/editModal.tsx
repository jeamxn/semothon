import React from "react";

import Input from "@front/components/input";
import useAuth from "@front/hooks/useAuth";

const EditModal = ({
  open, setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { me } = useAuth();

  const [name, setName] = React.useState(me.name);


  React.useEffect(() => {
    setName(me.name);
  }, [me, open]);

  return open ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl w-11/12 max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-full h-full max-h-[90vh] bg-dark/5 p-6 flex flex-col gap-4 overflow-y-auto">
          
          <p className="text-2xl font-bold">내 정보 수정</p>
          <Input
            title="이름"
            essential
            limit={100}
            placeholder="여기에 내용을 입력하세요."
            text={name}
            setText={setName}
          />
          <div className="w-full h-[1px] bg-dark/20" />

          {
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-0">
                  <p className="font-bold">세틀러</p>
                  <p className="text-dark/35">벤드 동아리</p>
                </div>
                <button className="bg-dark/5 border-dark/5 border rounded-2xl px-4 py-2">
                  <p className="text-key font-bold">탈퇴하기</p>
                </button>
              </div>
            ))
          }


          <div className="flex flex-row items-center gap-2">
            <button className="bg-dark/10 px-3 py-3 rounded-xl w-full" onClick={() => setOpen(false)}>
              <p className="text-dark font-bold">취소하기</p>
            </button>
            <button className="bg-key px-3 py-3 rounded-xl w-full" onClick={() => setOpen(false)}>
              <p className="text-white font-bold">수정하기</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditModal;