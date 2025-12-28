import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import ChatHeader from './ChatHeader'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton.jsx'
import NoChatHistoryPlaceholder from './NoChatHistoyPlaceholder.jsx'
import MessageInput from './MessageInput.jsx'
import { useEffect, useRef } from 'react'

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  if (!authUser || !selectedUser) {
    return <div className="flex justify-center items-center h-full text-slate-400">Loading chat...</div>;
  }

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
    subscribeToMessages()
    
    return () => unsubscribeFromMessages()
  }, [getMessagesByUserId, selectedUser, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className={`chat-bubble relative ${msg.senderId?.toString() === authUser?._id?.toString()
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <div className="relative">
                      <img
                        src={msg.image}
                        alt="shared"
                        className={`rounded-lg h-48 object-cover ${msg.status === "sending" ? "blur-sm opacity-70" : ""}`}
                      />

                      {msg.status === "sending" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                          <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  )}

                  {msg.text && <p className='mt-2'>{msg.text}</p>}
                  <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  )
}

export default ChatContainer
