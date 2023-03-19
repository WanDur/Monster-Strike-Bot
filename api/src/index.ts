// Modal window
const info_modal = document.getElementsByClassName("modal-box")[0] as HTMLElement
const close_info_modal_btn = document.getElementById("close-modal-icon")!
const info_modal_icon = document.getElementById("modal-icon")!
const info_modal_text = document.getElementById("modal-text")!
const info_modal_header = document.getElementById("modal-header")!

const default_icon = "pin"
const default_text =
    "The uid is printed on the terminal when you run the bot. Rerun the bot if you didn't mark it down."
const default_header = "Enter your user id"

// Input fields
const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(".opt-card-inputs input")

// Touchable
const infobtn = document.getElementById("infobtn")!
const how_uid = document.getElementById("how-uid")!

// Local storage
localStorage.removeItem("uid")
localStorage.removeItem("box3-info")
localStorage.removeItem("box1-info")
localStorage.removeItem("initTime")

interface ApiUser {
    count: string
    firstruntime: string
    log: string
}

interface ApiData {
    [key: string]: ApiUser
}

/**
 * Fetch all instances from ms_bot api
 * @returns a Promise that contains the Apidata
 */
const GetAllInstance = () => {
    return fetch("https://msbot.pythonanywhere.com/view")
        .then((response) => response.json())
        .then((data: ApiData) => {
            return data
        })
}

/**
 * Open dashboard with given user id
 * @param user_typed_id - user ID typed in index page
 * @returns A Promise that resolves to `true` if the user is logged in successfully
 */
const Login = (user_typed_id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        GetAllInstance().then((data) => {
            const keys = Object.keys(data)
            console.log(keys)

            if (keys.includes(user_typed_id)) {
                const myURL = document.URL
                window.location.href = `${myURL}dash`

                localStorage.setItem("uid", user_typed_id)
                localStorage.setItem("initTime", data[user_typed_id]["firstruntime"])

                resolve(true)
            } else {
                reject(new Error("Login Failed!"))
            }
        })
    })
}

const ChangeModalDisplay = (
    icon: string = default_icon,
    header: string = default_header,
    text: string = default_text
) => {
    info_modal_icon.innerText = icon
    info_modal_header.innerText = header
    info_modal_text.innerText = text
}

how_uid.addEventListener("click", (e: Event) => {
    e.preventDefault()
    info_modal.classList.add("modal-box-show")
})

close_info_modal_btn.addEventListener("click", () => {
    info_modal.classList.remove("modal-box-show")
    ChangeModalDisplay()
})

inputs.forEach((input: HTMLInputElement, index: number) => {
    let lastStatus = 0

    input.onkeyup = (e) => {
        const currElement: HTMLInputElement = e.target as HTMLInputElement
        const nextElement: HTMLInputElement | null = input.nextElementSibling as HTMLInputElement | null
        const prevElement: HTMLInputElement | null = input.previousElementSibling as HTMLInputElement | null

        if (prevElement && e.key == "Backspace") {
            if (lastStatus == 1) {
                prevElement.value = ""
                prevElement.focus()
            }
            lastStatus = 1
        } else if (e.key != "Enter") {
            const reg = /^[a-zA-Z0-9]+$/

            if (!reg.test(currElement.value)) {
                currElement.value = currElement.value.replace(/\D/g, "")
            } else if (currElement.value) {
                if (nextElement) {
                    nextElement.focus()
                } else {
                    lastStatus = 0
                    const allInputsFilled = Array.from(inputs).every((input) => input.value)

                    if (allInputsFilled) {
                        const uid = Array.from(inputs)
                            .map((input) => input.value)
                            .join("")
                        Login(uid).catch(() => {})
                    }
                }
            }
        }
    }

    if (index == inputs.length - 1) {
        input.addEventListener("keyup", (e) => {
            const allInputsFilled = Array.from(inputs).every((input) => input.value)

            if (allInputsFilled && e.key == "Enter") {
                const uid = Array.from(inputs)
                    .map((input) => input.value)
                    .join("")
                Login(uid).catch(() => {
                    ChangeModalDisplay(
                        "Warning",
                        "Invalid user id",
                        "The uid you provided does not exist in the server. Check your typing or get a new uid."
                    )
                    info_modal.classList.add("modal-box-show")
                })
            }
        })
    }
})
