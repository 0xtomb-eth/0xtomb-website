import {
  Box,
  TextField,
  Container,
  Button,
  Stack,
  Slide,
  Grid,
  Card,
  Typography,
  LinearProgress,
} from '@mui/material';
import { Controller } from 'react-hook-form';

import Layout from '../layout/Layout';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  useContractInfiniteReads,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import WILL_ABI from '../abi/willAbi.json';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const willContractConfig = {
  address: '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
  abi: WILL_ABI,
};

function Will() {
  const [active, setActive] = useState(1);
  const [willer, setWiller] = useState(null);
  //read data from contract

  const { config: ackDeathConfig, error } = usePrepareContractWrite({
    address: '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
    abi: WILL_ABI,
    functionName: 'ackDeath',
    args: [willer, true],
  });
  const { writeAsync: ackDeathWriteAsync } = useContractWrite(ackDeathConfig);

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
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pt: '80px',
          }}
        >
          {active == 1 && (
            <Stack direction={'row'} justifyContent="center">
              <Box
                component={'img'}
                src="/svg/skull.svg"
                width={'400px'}
                height={'400px'}
                mr={'20px'}
              />
              <Stack width={'400px'} justifyContent="center" gap={1}>
                <Typography
                  width={'180px'}
                  fontSize={'64px'}
                  fontWeight="200"
                  lineHeight={'64px'}
                >
                  Did he/she Die?
                </Typography>
                <Typography
                  fontSize={'15px'}
                  fontWeight={200}
                  fontStyle={'italic'}
                >
                  Put on address
                </Typography>

                <TextField
                  value={willer}
                  label="Willer Addres"
                  size="small"
                  fullWidth
                  // error={errors?.name?.message}
                  // helperText={errors?.name?.message}
                  onChange={(e) => {
                    setWiller(e.target.value);
                  }}
                />

                <Button
                  size="small"
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setActive(active + 1);
                  }}
                >
                  Index
                </Button>
              </Stack>
            </Stack>
          )}
          {active == 2 && (
            <Stack direction={'row'} justifyContent="center">
              <Box
                component={'img'}
                src="/svg/skull.svg"
                width={'400px'}
                height={'400px'}
                mr={'20px'}
              />
              <Stack width={'400px'} justifyContent="center" gap={1}>
                <Typography
                  fontSize={'15px'}
                  fontWeight={200}
                  fontStyle={'italic'}
                >
                  遗嘱状态如下
                </Typography>
                <Card sx={{ padding: '10px' }}>
                  <Typography align="center">确认进度：2/5</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.floor((2 / 5) * 100)}
                  />
                  <Typography align="center">受益人</Typography>
                </Card>

                <TextField
                  value={willer}
                  label="Willer Addres"
                  size="small"
                  fullWidth
                  // error={errors?.name?.message}
                  // helperText={errors?.name?.message}
                  onChange={(e) => {
                    setWiller(e.target.value);
                  }}
                />

                <Grid container gap={2}>
                  <Grid xs={5}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setActive(active - 1);
                      }}
                    >
                      Pre
                    </Button>
                  </Grid>
                  <Grid xs={5}>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        console.log('AckDeath');
                      }}
                    >
                      AckDeath
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          )}
          {/* {data.map((v, index) => {
            return (
              <Card
                key={index}
                onClick={() => {}}
                sx={{
                  width: 270,
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box component={'img'} src="/svg/skull.svg" width="50px" />
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: '30px',
                    lineHeight: '40px',
                  }}
                >
                  {v.name}的死亡证明
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: '15px',
                    mb: '5px',
                  }}
                >
                  确认进度
                </Box>
                <Box width={'80%'}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.floor((v.approved / v.total) * 100)}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: '10px',
                  }}
                >
                  {v.approved}/{v.total}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button>确认死亡</Button>
                </Box>
              </Card>
            );
          })} */}
        </Container>
      </Layout>
    </>
  );
}
export default Will;
