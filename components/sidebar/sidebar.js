import { CircularProgress, ClickAwayListener } from '@material-ui/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import css from './sidebar.module.css'

export default function Sidebar(props){
	const {userChats, username} = props
	const router = useRouter()
	const [userSearch, setUserSearch] = useState()
	const [foundUsers, setFoundUsers] = useState([])
	const [showSearch, setShowSearch] = useState(false)
	const [contacts, setContacts] = useState(<div></div>)

	/* CONDITIONALY RENDERING THE CONTACTS ON THE SIDEBAR */
	useEffect(()=>{
		if(userChats===null){
			setContacts(
				<div>
					<h2>Start Chatting With Other Users</h2>
				</div>
			)
		}
		if(userChats!==null){
			if(userChats.length<1){
				setContacts(
					<div style={{display:'flex', justifyContent:'center', padding:'20px'}}>
						<CircularProgress/>
					</div>
				)
			}
			if(userChats.length>0){
				setContacts(
					userChats.map((chat)=>{
						return(
							<a key={chat.chatID} onClick={()=>{router.push(`/chat/${chat.chatPartner}`)}}>
								<h4>{chat.chatPartner}</h4>
							</a>
						)
					})
				)
			}
		}
	},[userChats])
	/* searching for user */
	async function handleSearch(event){
		event.preventDefault()
		setShowSearch(true)
		try{
            const userChatDetail = await axios.get('/api/searchChat', {params:{userQuery:userSearch, username:username}});
            console.log(userChatDetail)
            setFoundUsers(userChatDetail.data)
        }catch(err){
			console.log(err)
        }
	}
	return(
		<>
		<ClickAwayListener onClickAway={()=>{setShowSearch(false)}}>
			<div className={css.sidebarContainer}>
				<div>
					<form onSubmit={handleSearch}>
						<input type="search" value={userSearch} onChange={((e)=>{setUserSearch(e.target.value)})}></input>
						<button type="submit">Search</button>
					</form>
					<div style={{display:showSearch?'block':'none'}}>
						{foundUsers.map((user)=>{
							return(
								<div onClick={()=>{router.push(`/chat/${user.username}`)}}>
									<p>
										{user.username}
									</p>
								</div>
							)
						})}
					</div>
				</div>
				{contacts}
			</div>
		</ClickAwayListener>
		</>
	)
}