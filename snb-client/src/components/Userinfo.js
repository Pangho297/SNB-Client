import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Modal from './modal/CenterModal';
import AddList from './AddList';
import RemoveList from './RemoveList';
import Song from './Song';
import './Userinfo.css';

const Userinfo = ({ userdata, listHandler }) => {
  const [list, setList] = useState(''); // 선택한 list의 id를 저장하는 상태
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isAddBtn, setIsAddBtn] = useState(true);
  const [songs, setSongs] = useState([]); // 유저가 가진 list안의 노래들
  const [songList, setSongList] = useState([]); // 체크박스로 선택한 list안의 노래들

  const isAdd = (e) => {
    if (e.target.value === 'true') {
      setIsAddBtn(true);
      openPopUp();
    } else {
      setIsAddBtn(false);
      openPopUp();
    }
  };

  const openPopUp = () => {
    setIsOpenPopup(true);
  };

  const closePopUp = () => {
    setIsOpenPopup(false);
  };

  const requestAddList = async (name) => {
    return await axios.post('https://localhost:4000/mylist/add',
      { 'email': userdata.email, 'listname': name },
      { 'Content-Type': 'application/json', withCredentials: true })
      .then((res) => {
        userdata.lists.push({ id: res.data.id, name });
        setSongs([]);
        return res.status === 201 ? true : false;
      });
  };

  const requestRemoveList = async () => {
    return await axios.post('https://localhost:4000/mylist/remove',
      { 'listid': Number(list) },
      { 'Content-Type': 'application/json', withCredentials: true })
      .then((res) => {
        userdata.lists = userdata.lists.filter((data) => data.id !== Number(list));
        return res.status === 200 ? true : false;
      });
  };

  const requestRemoveSong = async () => {
    console.log(songs, '삭제 전');
    return await axios.post('https://localhost:4000/mylist/song/remove',
      { 'listid': Number(list), 'songs': songList },
      { 'Content-Type': 'application/json', withCredentials: true })
      .then(() => {
        axios.post('https://localhost:4000/mylist/info',
          { 'listid': Number(list) },
          { 'Content-Type': 'application/json', withCredentials: true })
          .then((res) => setSongs(res.data.Song))
          .then(setSongList([]));
      });
  };

  const getDate = () => {
    const date = userdata.createdAt.split('T');
    const yymmdd = date[0].split('-');
    return `${yymmdd[0]}년 ${yymmdd[1]}월 ${yymmdd[2]}일 가입`;
  };

  const getSongs = (songInfo) => {
    console.log(songList, '체크 전');
    if (!songInfo.checked) {
      let song = songList.filter(el => Number(el.songNum) !== Number(songInfo.data.songNum));
      setSongList(song);
    } else {
      setSongList([...songList, songInfo.data]);
    }
    console.log(songList, '체크 후');
  };

  useEffect(async () => {
    if (list) {
      await axios.post('https://localhost:4000/mylist/info',
        { 'listid': Number(list) },
        { 'Content-Type': 'application/json', withCredentials: true })
        .then((res) => setSongs(res.data.Song))
        .catch(() => setSongs([]));
    }
  }, [list]);

  return (
    <div className="userinfo">
      <div className="userinfo-box">
        <Modal visible={isOpenPopup} color={'#fff'} isBlackBtn={true} onClose={closePopUp}>
          {isAddBtn
            ? (<AddList
              addListCallback={requestAddList}
              closeCallback={closePopUp}
              listHandler={listHandler}
            />)
            : (<RemoveList
              removeListCallback={requestRemoveList}
              closeCallback={closePopUp}
              listHandler={listHandler}
            />)}
        </Modal>
        <div className="userinfo-username">{userdata.username}</div>
        <div className="userinfo-email">{userdata.email}</div>
        <div className="userinfo-createdAt">{getDate()}</div>
        <div className="userinfo-listbox">
          <select
            className="userinfo-dropdown"
            value={list}
            onChange={e => setList(e.target.value)}
          >
            <option className="userinfo-option" >리스트를 선택해주세요</option>
            {userdata.lists.map(data => {
              return <option className="userinfo-option" key={data.id} value={data.id}>{data.name}</option>;
            })}
          </select>
          <button className="userinfo-addlist" onClick={isAdd} value="true">add List</button>
          <button className="userinfo-removelist" onClick={isAdd} value="false">remove List</button>
        </div>
      </div>
      <div className="userinfo-rightbox">
        <div className="userinfo-songsbox">
          <div className="userinfo-songbar">
            <div>번호</div>
            <div>제목</div>
            <div>가수</div>
            <div>미디어 / 버튼</div>
          </div>
          {songs ? (songs.map((data) =>
            <Song
              key={data.songNum}
              songNum={data.songNum}
              title={data.title}
              singer={data.singer}
              link={data.link}
              getSongs={getSongs}
            />))
            : <div></div>}
          <div className="userinfo-removebox">
            <div className="userinfo-seletsong">{songList.length}/{songs.length}</div>
            <button className="userinfo-removesong" onClick={requestRemoveSong}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

Userinfo.propTypes = {
  userdata: PropTypes.object,
  listHandler: PropTypes.func,
  requestRemoveList: PropTypes.func,
  openPopUp: PropTypes.func
};

export default Userinfo;