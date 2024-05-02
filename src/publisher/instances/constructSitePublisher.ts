// export class ConstructSitePublisher implements Publisher {
//     publish(room: Room): void {
//         const targets = room.find(FIND_MY_CONSTRUCTION_SITES)
//         const msgs = targets.sort((a, b) => b.progress - a.progress).map(o => {
//             return { target: [o], type: 'build', priority: 50 }
//         })
//         if (msgs.length) room.messageQueue.push(...msgs)
//     }

// }
