import React from "react";

import { Activity } from "@common/types/responses";

import Input from "@front/components/input";
import useAuth from "@front/hooks/useAuth";

const SubmitModal = ({
  open, setOpen, info
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  info: Activity;
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
          
          <p className="text-2xl font-bold">{info.name} 지원하기</p>
          <Input
            title="이름"
            essential
            limit={100}
            placeholder="여기에 내용을 입력하세요."
            text={name}
            setText={setName}
          />
          <Input
            title="학번"
            essential
            limit={100}
            placeholder="여기에 내용을 입력하세요."
          />
          <Input
            title="학과"
            essential
            limit={100}
            placeholder="여기에 내용을 입력하세요."
          />
          <Input
            title="연락처"
            essential
            limit={100}
            placeholder="여기에 내용을 입력하세요."
          />
          <Input
            title="간단한 자기소개 부탁드립니다!"
            essential
            limit={1000}
            placeholder="여기에 내용을 입력하세요."
          />


          <button className="bg-dark px-3 py-3 rounded-xl w-full" onClick={() => setOpen(false)}>
            <p className="text-white font-bold">수정하기</p>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SubmitModal;