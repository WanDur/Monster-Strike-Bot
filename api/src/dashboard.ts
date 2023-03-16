// Elements by ID
const match_count_label = document.getElementById("match-label")!
const runtime_label = document.getElementById("runtime-label")!
const info_icon = document.getElementById("info-icon")!
const info_text = document.getElementById("info-text")!
const info_label = document.getElementById("info-label")!
// Elements by CLASS
const act_status_time: HTMLCollectionOf<Element> = document.getElementsByClassName("data status")
const act_info: HTMLCollectionOf<Element> = document.getElementsByClassName("data info")

// Local storage
const uid: string | null = localStorage.getItem("uid")
const initialMatchCount: string | null = localStorage.getItem("box1-info")
const initialInfoBoxInfo: string | null = localStorage.getItem("box3-info")

localStorage.removeItem("prevActivity")

// State
let match_prevValue = match_count_label.innerText

// debug
const isDebug = false

/**
 * Fetch data from ms_bot api
 *
 * @returns a Promise that contains the data
 */
const FetchApiData = () => {
    return fetch("https://msbot.pythonanywhere.com/view").then((response) => response.json())
}

/**
 * Fetch activity data for specified user ID and updates the activity HTML elements if the activity has changed
 *
 * @param {string} userID - The user ID for which to fetch data
 */
const FetchActivityAndUpdate = (userID: string) => {
    if (info_icon.innerText == "done_all") {
        FetchApiData().then((data) => {
            try {
                const log: string = data[userID].log

                if (!IsActivitySame(log)) {
                    const allLogs = FormatApiLogText(log)
                    const status = allLogs[0].split(" ")[1]

                    UpdateActivityHTML(act_status_time, allLogs[1], status)
                    UpdateActivityHTML(act_info, allLogs[2], status)
                }
                localStorage.setItem("prevActivity", JSON.stringify(log))
            } catch (error) {
                console.error("Failed to update activity:", error)
            }
        })
    }
}

/**
 * Fetch match count for specified user ID and updates the match count label HTML element
 *
 * @param {string} userID - The user ID for which to fetch match count data
 */
const UpdateMatchCountLabel = (userID: string) => {
    FetchApiData().then((data) => {
        try {
            const count: number = data[userID].count
            match_count_label.innerText = count.toString()
        } catch (error) {
            console.error("Failed to update count label:", error)
        } finally {
            UpdateMatchStorage()
        }
    })
}

/**
 * Convert the status string into an array of three strings
 *
 * @param status - The status string that will be converted
 * @returns An array of three strings: the status text, time info, and message
 */
const FormatApiLogText = (status: string): [string, string, string] => {
    const statusArr = status.split(" ")

    const statusText = statusArr.slice(0, 3).join(" ")
    const timeText = CheckTimeIsToday(statusArr.slice(3, 5).join(" "))
    const msgText = statusArr.slice(5).join(" ")

    return [statusText, timeText, msgText]
}

/**
 * Check if the date of timeText is Today
 * if yes, return "Today"
 *
 * @param timeText
 * @returns "Today" if is today, return timeText if not
 */
const CheckTimeIsToday = (timeText: string) => {
    const [date, time] = timeText.split(" ")
    const [todayMonth, todayDate] = date.split("-")

    const today = new Date()
    const dateObj = new Date(today.getFullYear(), parseInt(todayMonth) - 1, parseInt(todayDate))

    if (dateObj.getDate() == today.getDate() && dateObj.getMonth() == today.getMonth()) {
        return `Today ${time}`
    } else return timeText
}

/**
 * Update the local storage with the current info box data
 */
const UpdateInfoStorage = () => {
    localStorage.setItem(
        "box3-info",
        JSON.stringify({
            icon: info_icon.innerText,
            text: info_text.innerText,
            label: info_label.innerText,
        })
    )
}

/**
 * Update the local storage with the current match count data
 */
const UpdateMatchStorage = () => {
    localStorage.setItem("box1-info", match_count_label.innerText)
}

/**
 * Update the info box HTML elements with the specified values and updates the local storage with the new data
 *
 * @param {string} icon - The icon in the info box
 * @param {string} text - The text in the info box
 * @param {string} label - The label in the info box
 */
const UpdateInfoDisplay = (icon: string, text: string, label: string) => {
    info_icon.innerText = icon
    info_text.innerText = text
    info_label.innerText = label

    UpdateInfoStorage()
}

/**
 * Update the runtime label with the time elapsed since the provided timestamp
 *
 * @param {number} timestamp - starting timestamp in seconds
 */
const UpdateTimeLabel = (timestamp: number) => {
    const now = Date.now()
    const diff = Math.abs(now - timestamp * 1000)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60)) % 60
    const seconds = Math.floor(diff / 1000) % 60

    runtime_label.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
}

/**
 * Monitor the update time and displays error message if the update takes longer than the specified time
 *
 * @param {number} maxTime - The maximum time allowed for the update in milliseconds
 */
const MonitorUpdateTime = (maxTime: number) => {
    let currentValue = document.getElementById("match-label")!.innerText

    if (Date.now() - startTime > maxTime) {
        UpdateInfoDisplay("chronic", "Failed to update matches!", "> Error")
    }
    if (currentValue != match_prevValue) {
        UpdateInfoDisplay("done_all", "Info", "> All good")
        startTime = Date.now()
    }
    match_prevValue = currentValue
}

/**
 * Format date string from "MM-DD" to "Month-DD"
 * @param dateString - The date string to format
 * @returns The formatted date string
 */
const FormatDate = (dateString: string): string => {
    const dateArray = dateString.split("-")
    const month = parseInt(dateArray[0])
    const day = parseInt(dateArray[1])
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    return `${months[month - 1]}-${day}`
}

/**
 * Check if the current activity is the same as the previous one stored in local storage
 * @param log - current activity log
 * @returns True if the current activity is the same as the previous activity, false otherwise
 */
const IsActivitySame = (log: string): boolean => {
    return JSON.stringify(log) == localStorage.getItem("prevActivity")
}

/**
 * Update the activity HTML element with a new span containing the provided text and status
 * @param activity - The activity HTML element to update
 * @param text - The text to display in the new span
 * @param status - The status which will change the class name in css to change color
 */
const UpdateActivityHTML = (activity: HTMLCollectionOf<Element>, text: string, status: string) => {
    const spanCount = activity[0].children.length
    const span = document.createElement("span")
    span.innerHTML = `
      <span class="data-list ${status.toLowerCase()}">${text}</span>
    `
    if (spanCount > 9) {
        const lastChild = activity[0].lastElementChild!
        lastChild.classList.add("remove")
        setTimeout(() => {
            activity[0].removeChild(lastChild)
            activity[0].prepend(span)
            span.classList.add("active")
            setTimeout(() => {
                span.classList.remove("active")
            }, 300)
        }, 300)
    } else {
        activity[0].prepend(span)
        span.classList.add("active")
        setTimeout(() => {
            span.classList.remove("active")
        }, 300)
    }
}

window.onload = () => {
    const uid_label = document.getElementById("uid-display")!
    if (!uid) uid_label.innerText = "xxxxx"
    else uid_label.innerText = uid

    if (!initialMatchCount) {
        match_count_label.innerText = "0"
    } else {
        match_count_label.innerText = localStorage.getItem("box1-info")!
    }

    if (!uid) {
        UpdateInfoDisplay("problem", "Failed to load your data!", "> Error")
        return
    }
    if (initialInfoBoxInfo) {
        const _info = JSON.parse(initialInfoBoxInfo)
        UpdateInfoDisplay(_info["icon"], _info["text"], _info["label"])
    } else {
        UpdateInfoDisplay("done_all", "Info", "> All good")
    }
}

info_label.addEventListener("click", () => {
    if (info_icon.innerText == "chronic") {
        alert(`Error occured because the total number of matches is not updating.
Check your bot!`)
    } else if (info_icon.innerText == "problem") {
        alert(`Error occured because we cannot find your data.
Try refreshing the page and enter the uid again.`)
    } else if (info_icon.innerText == "done_all") {
        alert(`Your bot runs well!`)
    }
})

if (uid) {
    const firstrun = parseInt(localStorage.getItem("initTime")!)
    const monitor_time = isDebug ? 15000 : 200000

    setInterval(() => {
        UpdateTimeLabel(firstrun)
    }, 1000)

    setInterval(() => {
        UpdateMatchCountLabel(uid)
        FetchActivityAndUpdate(uid)
        MonitorUpdateTime(monitor_time)
    }, 6000)
}

let startTime = Date.now()
