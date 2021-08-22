import React, { useState } from 'react';
import UserInfoModal from './UserInfoModal';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { EvilIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

const HeaderNavigation = props => {
    const [setModal, setModalState] = useState(false)
    const handleClose = () => {
        setModalState(false)
    }
    return (
        <TouchableOpacity><HeaderButtons HeaderButtonComponent={HeaderButton}>
            <EvilIcons name={"user"} size={36} color={"white"} style={{ right: 10 }} onPress={() => setModalState(true)} />
            {setModal === true ? <UserInfoModal state={true} navigation={props.navigation} handleClose={handleClose} /> : null}
        </HeaderButtons>
        </TouchableOpacity>
    )
}

export default HeaderNavigation;