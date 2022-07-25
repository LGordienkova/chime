import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  VideoTileGrid,
  AudioInputControl,
  VideoInputControl,
  AudioOutputControl,
  ControlBar,
  ControlBarButton,
  Phone,
  ModalButtonGroup,
  ModalButton,
  Modal,
  ModalHeader,
  ModalBody,
} from 'amazon-chime-sdk-component-library-react';

import { useAppContext } from '../../providers/AppProvider';
import { useMeetingContext } from '../../providers/MeetingProvider';
import { StyledP } from './Styled';

const Meeting = () => {
  const { meetingInfo, connected } = useAppContext();
  const { endMeeting, meetingManager } = useMeetingContext();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!meetingInfo && !connected) {
      meetingManager.leave().then(() => navigate('/'));
    }
  }, [meetingInfo, connected]);

  const toggleModal = () => setShowModal(!showModal);

  const endMeetingForAll = async () => {
    try {
      await endMeeting();
      navigate('/');
    } catch (e) {
      console.error(`Could not end meeting: ${e}`);
    }
  };

  return (
    <Flex layout="fill-space-centered" style={{ height: '100vh' }} flexDirection="column">
      <VideoTileGrid />
      <ControlBar layout="undocked-horizontal" showLabels>
        <VideoInputControl />
        <AudioInputControl />
        <AudioOutputControl />
        <ControlBarButton icon={<Phone />} onClick={toggleModal} label="Leave" />
      </ControlBar>
      {showModal && (
        <Modal size="md" onClose={toggleModal} rootId="modal-root">
          <ModalHeader title="End Meeting" />
          <ModalBody>
            <StyledP>Are you sure you want to end meeting for all?</StyledP>
          </ModalBody>
          <ModalButtonGroup
            primaryButtons={[
              <ModalButton
                key="end-meeting-for-all"
                onClick={endMeetingForAll}
                variant="primary"
                label="End meeting"
                closesModal
              />,
              <ModalButton
                key="cancel-meeting-ending"
                variant="secondary"
                label="Cancel"
                closesModal
              />,
            ]}
          />
        </Modal>
      )}
    </Flex>
  );
};

export default Meeting;
