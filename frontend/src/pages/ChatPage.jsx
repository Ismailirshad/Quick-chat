import { useChatStore } from '../store/useChatStore.js'
import BorderAnimatedContainer from '../components/BorderAnimation'
import ChatContainer from '../components/ChatContainer'
import NoConversationContainer from '../components/NoConversationContainer'
import ContactList from '../components/ContactList'
import ChatList from '../components/ChatList'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import ProfileHeader from '../components/ProfileHeader'

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore()

  return (
    <div className="relative w-full max-w-6xl h-[700px]">
      <BorderAnimatedContainer>

        <div
          className={`
            md:w-80 w-full bg-slate-800/50 backdrop-blur-sm flex flex-col
            ${selectedUser ? 'hidden md:flex' : 'flex '}
          `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === 'chats' ? <ChatList /> : <ContactList />}
          </div>
        </div>

        <div
          className={`
            flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm
            ${selectedUser ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationContainer />}
        </div>

      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage

