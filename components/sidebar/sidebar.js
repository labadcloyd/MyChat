import { CircularProgress, ClickAwayListener } from '@material-ui/core'
import { ExitToApp, Search } from '@material-ui/icons'
import axios from 'axios'
import { signOut } from 'next-auth/client'
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
					<h5 style={{fontSize:'1rem', paddingLeft:'10px', margin:'10px, 10px'}}>Start Chatting With Other Users</h5>
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
					userChats.map((chat, index)=>{
						return(
							<h1 className={css.contact} key={index} onClick={()=>{router.push(`/chat/${chat.chatPartner}`)}}>
								{chat.chatPartner}
							</h1>
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
	/* LOGING OUT THE USER */
	function logoutHandler() {
		signOut();
		return router.push('/auth')
	}
	return(
		<>
		<ClickAwayListener onClickAway={()=>{setShowSearch(false)}}>
			<div className={css.sidebarContainer}>
				<div className={css.logoHeader}>
					<h1 className={css.logo}>MyChat</h1>
					<p onClick={logoutHandler}><ExitToApp/>Logout</p>
				</div>
				<form onSubmit={handleSearch} className={css.searchbar}>
					<input placeholder="Search for a user" type="search" value={userSearch} onChange={((e)=>{setUserSearch(e.target.value)})}></input>
					<button type="submit"><Search/></button>
					<div className={css.searchResults} style={{display:showSearch?'flex':'none'}}>
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
				</form>
				{contacts}
			</div>
		</ClickAwayListener>
		</>
	)
}