import {
  Box,
  Container,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle,
  Dialog,
  Button,
  Card,
  Slide,
} from '@mui/material';
import Layout from '../layout/Layout';
import React from 'react';
import { useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import WILL_ABI from '../abi/willAbi.json';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cemetery() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const { data: totalDate } = useContractRead({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: WILL_ABI,
    functionName: 'totalTokens',
  });
  const nftConfig = {
    address: '0x1dfe7ca09e99d10835bf73044a23b73fc20623df',
    abi: WILL_ABI,
    functionName: 'gettoken',
  };
  const { data: nftList } = useContractReads({
    contracts: Array.from({ from: totalDate }, (_, i) => i).map((val) => {
      return {
        ...nftConfig,
        args: [val],
      };
    }),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const data = [
    {
      name: 'Alice',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
    {
      name: 'Bob',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
    {
      name: 'Charlie',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
    {
      name: 'David',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
    {
      name: 'Emma',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
    {
      name: 'Frank',
      approved: 1,
      total: 10,
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
      beneficiaries: [],
    },
  ];
  return (
    <>
      <Layout>
        <Container
          // maxWidth="lg"
          width="100%"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: 'full',
            justifyContent: 'start',
            mt: 6,
            gap: 2,
          }}
        >
          {data.map((v, index) => {
            return (
              <Card
                key={index}
                onClick={() => {
                  setCurrent(index);
                  handleClickOpen();
                }}
                sx={{
                  width: 270,

                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box
                  component={'img'}
                  src="https://bafkreienstjnl3lkobjucphs7fauyznhe7nmsyt37bqxz5mksevotf4eye.ipfs.nftstorage.link/"
                  width="250px"
                />
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: '30px',
                    lineHeight: '40px',
                  }}
                >
                  {v.name}的坟墓
                </Box>
              </Card>
            );
          })}
        </Container>
      </Layout>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{data?.length && data[current].name}的遗嘱</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ whiteSpace: 'pre-line' }}
          >
            {data?.length && data[current].content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Cemetery;
