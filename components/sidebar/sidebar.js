import axios from 'axios'
import { useEffect, useState } from 'react'
import css from './sidebar.module.css'

export default function Sidebar(props){
	const {userChats} = props
	const [currentChats, setCurrentChats] = useState()
	const [userSearch, setUserSearch] = useState()
	const [foundUsers, setFoundUsers] = useState()
	useEffect(()=>{
		if(userChats){
			setCurrentChats(userChats)
		}
	},[])
	/* searching for user */
	async function handleSearch(){
		try{
            const userChatDetail = await axios.get('/api/getUserChat', {params:{userQuery:userSearch}});
            console.log(userChatDetail)
            setFoundUsers(userChatDetail.data)
        }catch(err){
			console.log(err)
        }
	}
	
	return(
		<>
			<div className={css.sidebarContainer}>
				<div>
					<div>	
						<input type="search" value={userSearch} onChange={((e)=>{setUserSearch(e.target.value)})}></input>
						<button onClick={handleSearch}>Search</button>
					</div>
					<div>

					</div>
				</div>
				{!currentChats &&
					<div>
						<h2>Start Chatting With Other Users</h2>
					</div>
				}
				{currentChats &&
					userChats.map((chat)=>{
						return(
							<div key={chat.chatID}>
								<h3>{chat.sender}</h3>
							</div>
						)
					})
				}
			</div>
		</>
	)
}