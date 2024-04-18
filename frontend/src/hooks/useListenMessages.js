import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import useConversation from '../zustand/useConversation'
import notiSound from '../assets/sounds/frontend_src_assets_sounds_notification.mp3'

function useListenMessages() {
    const { socket } = useSocketContext()
    const { messages, setMessages } = useConversation()

    useEffect(() => {
        socket?.on("newMessage", (message) => {
            message.shouldShake = true
            const sound = new Audio(notiSound)
            sound.play()
            setMessages([...messages, message])
        })

        return () => {
            socket?.off("newMessage")
        }
    }, [socket, setMessages, messages]);
}

export default useListenMessages