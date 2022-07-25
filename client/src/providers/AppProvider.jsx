import React, { createContext, useContext, useRef, useState } from 'react';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [partnerNameInput, setPartnerNameInput] = useState('');
  const socket = useRef();

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:8080');

    socket.current.onopen = () => {
      const message = {
        type: 'connect',
        userName: userNameInput,
      };

      socket.current?.send(JSON.stringify(message));

      setConnected(true);
    };

    socket.current.onmessage = async event => {
      const data = JSON.parse(event.data);

      if (data.type === 'meetingInfoForIncomingCall') {
        setMeetingInfo(data);
      }

      if (data.type === 'meetingInfoForOutgoingCall') {
        setMeetingInfo(data.meetingInfo);
        setPartnerNameInput(data.meetingInfo.callingFrom);

        setMessageSent(true);
      }

      if (data.type === 'meetingEnded') {
        closeConnection();
        setMessageSent(false);
        setMeetingInfo(null);
        setUserNameInput('');
        setPartnerNameInput('');
      }

      console.log(data);
    };

    socket.current.onclose = () => {
      setConnected(false);
      setMeetingInfo(null);
      setMessageSent(false);
      setUserNameInput('');
      setPartnerNameInput('');

      console.log('Socket closed');
    };

    socket.current.onerror = error => {
      console.log(error);
    };
  };

  const closeConnection = () => {
    const message = {
      type: 'close',
    };

    socket.current?.send(JSON.stringify(message));

    socket.current?.close();
  };

  const sendMeetingInfo = () => {
    socket.current?.send(
      JSON.stringify({
        type: 'sendMeetingInfo',
        meetingInfo,
      })
    );
  };

  const deleteMeeting = () => {
    socket.current?.send(
      JSON.stringify({
        type: 'deleteMeeting',
        meetingId: meetingInfo.Meeting.MeetingId,
      })
    );
  };

  const createMeeting = () => {
    const message = {
      type: 'createMeeting',
      userName: userNameInput,
      callingTo: partnerNameInput,
    };

    socket.current?.send(JSON.stringify(message));
  };

  const providerValue = {
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
    deleteMeeting,
  };

  return <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
