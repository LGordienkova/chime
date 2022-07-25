import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import {
  Flex,
  Heading,
  Input,
  lightTheme,
  MeetingProvider,
  PrimaryButton,
  SecondaryButton,
} from 'amazon-chime-sdk-component-library-react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../providers/AppProvider';
import { useMeetingContext } from '../providers/MeetingProvider';

const Home = () => {
  const {
    meetingInfo,
    connect,
    connected,
    setUserNameInput,
    setPartnerNameInput,
    closeConnection,
    createMeeting,
    partnerNameInput,
    userNameInput,
    sendMeetingInfo,
    messageSent,
  } = useAppContext();
  const { configureMeetingSession, joinOutgoingCallerToMeeting } = useMeetingContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (messageSent && connected && meetingInfo) {
      joinOutgoingCallerToMeeting(meetingInfo);

      navigate(`/meeting/${meetingInfo.Meeting.MeetingId}`);
    }
  }, [messageSent]);

  const handleJoiningMeeting = async () => {
    try {
      const { meetingSessionConfiguration } = await configureMeetingSession();

      sendMeetingInfo();

      navigate(`/meeting/${meetingSessionConfiguration.meetingId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <Flex layout="fill-space-centered" style={{ height: '100vh' }} flexDirection="column">
          {connected && !meetingInfo && (
            <Input
              onChange={e => setPartnerNameInput(e.target.value)}
              value={partnerNameInput}
              placeholder="Enter attendee name"
              type="text"
            />
          )}

          {connected && !meetingInfo && (
            <PrimaryButton
              label="Start video call"
              disabled={false}
              onClick={createMeeting}
              style={{ marginTop: '2vw' }}
            />
          )}

          {connected && meetingInfo && userNameInput !== meetingInfo?.callingFrom && (
            <Heading
              level={4}
              style={{ color: 'green' }}
            >{`${meetingInfo.callingFrom} is calling`}</Heading>
          )}

          {connected && meetingInfo && (
            <PrimaryButton
              label="Join video call"
              disabled={false}
              style={{ marginTop: '4vw' }}
              onClick={handleJoiningMeeting}
            />
          )}

          {!connected && (
            <Input
              onChange={e => setUserNameInput(e.target.value)}
              value={userNameInput}
              placeholder="Enter your name"
              type="text"
            />
          )}

          {!connected && (
            <SecondaryButton
              label="Connect to server"
              disabled={false}
              onClick={connect}
              style={{ marginTop: '2vw' }}
            />
          )}

          {connected && (
            <SecondaryButton
              label="Close connection"
              disabled={false}
              onClick={closeConnection}
              style={{ marginTop: '2vw' }}
            />
          )}
        </Flex>
      </MeetingProvider>
    </ThemeProvider>
  );
};

export default Home;
