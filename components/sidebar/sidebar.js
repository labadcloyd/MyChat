import { ClickAwayListener } from '@material-ui/core'
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
	/* searching for user */
	async function handleSearch(event){
		event.preventDefault()
		setShowSearch(true)
		try{
            const userChatDetail = await axios.get('/api/getUserChat', {params:{userQuery:userSearch, username:username}});
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
				{!userChats &&
					<div>
						<h2>Start Chatting With Other Users</h2>
					</div>
				}
				{userChats &&
					userChats.map((chat)=>{
						return(
							<div key={chat.chatID}>
								<h3>{chat.sender}</h3>
							</div>
						)
					})
				}
			</div>
		</ClickAwayListener>
		</>
	)
}