import React, {
  useState,
  useEffect,
  useContext,
  createRef,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../context/user_context";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import { getWebContainer } from "../config/webContainer";
import Navbar from "../components/Navbar";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);

  const [iframeUrl, setIframeUrl] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

  const messageBox = createRef();

  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  const handleUserClick = (userId) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(userId)) {
        newSelectedUserId.delete(userId);
      } else {
        newSelectedUserId.add(userId);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    appendOutgoingMessage(message);
    saveMessages(message);
    setMessage("");
  };

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer()
        .then((container) => {
          setWebContainer(container);
          console.log("Container started");
        })
        .catch((err) => {
          console.error("Error initializing WebContainer:", err);
        });
    }

    receiveMessage("project-message", (data) => {
      console.log("data", data); //remove later
      let message;
      if (typeof data.message === "object" && data.message !== null) {
        message = data.message;
      } else {
        try {
          message = JSON.parse(data.message);
        } catch {
          message = data.message;
        }
      }

      if (message.fileTree) {
        setFileTree(message.fileTree);
        webContainer?.mount(message.fileTree);
      } else {
        setFileTree({});
        setOpenFiles([]);
      }
      appendIncomingMessage(data);
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project);
        setFileTree(res.data.project.fileTree);
        setMessages(res.data.project.messages);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const appendIncomingMessage = (messageObject) => {
    setMessages((prev) => [...prev, { ...messageObject }]);
  };

  const appendOutgoingMessage = (message) => {
    setMessages((prev) => [...prev, { message, sender: user }]);
  };

  function WriteAiMessage(message) {
    let text = "";

    if (typeof message === "object" && message !== null) {
      text = message.text || "";
    } else if (typeof message === "string" && message.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(message);
        text = parsed.text || message;
      } catch (e) {
        text = message;
      }
    } else {
      text = message;
    }

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);

  function saveFileTree(ft) {
    console.log("save file tree");
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log("success", res.data);
      })
      .catch((err) => {
        console.log("failure", err);
      });
  }

  function saveMessages(msg) {
    console.log("save messages");
    console.log(project._id, msg);
    axios
      .put("/projects/add-messages", {
        projectId: project._id,
        message: msg,
      })
      .then((res) => {
        console.log("success", res.data);
      })
      .catch((err) => {
        console.log("failure", err);
      });
  }

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  // console.log("project", location.state);
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 overflow-hidden">
        <section className="left relative flex flex-col  min-w-80 bg-slate-300 overflow-hidden">
          <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
            <button
              className="flex gap-2 cursor-pointer"
              onClick={() => {
                console.log("click");
                setIsModalOpen(true);
              }}
            >
              <i className="ri-add-fill mr-1"></i>
              <p className="font-semibold">Add Collaborator</p>
            </button>

            <button
              className="p-2"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-group-fill cursor-pointer"></i>
            </button>
          </header>

          <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
            <div
              ref={messageBox}
              className="message-box flex-grow flex flex-col gap-2 p-2 overflow-auto max-h-full"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message flex flex-col p-2 ${
                    msg.sender._id == user._id
                      ? "ml-auto bg-slate-200"
                      : "mr-auto bg-slate-200"
                  } ${msg.sender._id === "ai" ? "max-w-72" : "max-w-56"}`}
                >
                  <small className="opacity-65 text-xs">
                    {msg.sender?.email || "AI"}
                  </small>
                  <div className="text-sm">
                    {msg.sender && msg.sender._id === "ai" ? (
                      WriteAiMessage(msg.message)
                    ) : (
                      <p>{msg.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="inputField w-full flex absolute bottom-0">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 px-4 border-none outline-none bg-slate-50 flex-grow resize-none"
                placeholder="Enter message"
                rows="1"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              />
              <button
                onClick={send}
                className="px-5 bg-slate-950 text-white hover:bg-slate-900"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>

          <div
            className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute top-0 transition-all ${
              isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <header className="flex justify-between items-center p-2 px-4 bg-slate-200">
              <h1 className="text-lg font-semibold">Collaborators</h1>
              <button
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className="p-2"
              >
                <i className="ri-close-fill cursor-pointer"></i>
              </button>
            </header>

            <div className="users flex flex-col gap-2">
              {project.users &&
                project.users.map((user, idx) => {
                  return (
                    <div
                      key={idx}
                      className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
                    >
                      <div className="aspect-square rounded-full w-fit h-fit flex justify-center items-center p-5 text-white bg-slate-600 ">
                        <i className="ri-user-fill absolute"></i>
                      </div>

                      <h1 className="font-semibold text-lg">{user.email}</h1>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        <section className="right bg-red-50 flex-grow h-full flex">
          <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
            <div className="file-tree w-full">
              {fileTree &&
                Object?.keys(fileTree).map((file, index) => (
                  <button
                    key={index}
                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
                    onClick={() => {
                      setCurrentFile(file);
                      setOpenFiles([...new Set([...openFiles, file])]);
                    }}
                  >
                    <p className="font-semibold text-lg">{file}</p>
                  </button>
                ))}
            </div>
          </div>

          <div className="code-editor flex flex-col flex-grow h-full shrink">
            <div className="top flex justify-between w-full">
              <div className="files flex">
                {openFiles.map((file, index) => (
                  <button
                    key={index}
                    className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-fit ${
                      currentFile === file ? "bg-slate-400" : ""
                    }`}
                    onClick={() => {
                      setCurrentFile(file);
                    }}
                  >
                    <p className="font-semibold text-lg">{file}</p>
                    <i
                      className="ri-close-fill"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newOpenFiles = openFiles.filter(
                          (f) => f !== file
                        );

                        setOpenFiles(newOpenFiles);
                        if (currentFile === file) {
                          if (newOpenFiles.length > 0) {
                            const closedIndex = openFiles.indexOf(file);
                            const newIndex =
                              closedIndex > 0 ? closedIndex - 1 : 0;
                            setCurrentFile(newOpenFiles[newIndex]);
                          } else {
                            setCurrentFile(null);
                          }
                        }
                      }}
                    ></i>
                  </button>
                ))}
              </div>

              <div className="actions flex gap-2">
                <button
                  onClick={async () => {
                    await webContainer.mount(fileTree);

                    const installProcess = await webContainer.spawn("npm", [
                      "install",
                    ]);

                    installProcess.output.pipeTo(
                      new WritableStream({
                        write(chunk) {
                          console.log(chunk);
                        },
                      })
                    );

                    if (runProcess) {
                      runProcess.kill();
                    }

                    let tempRunProcess = await webContainer.spawn("npm", [
                      "start",
                    ]);

                    tempRunProcess.output.pipeTo(
                      new WritableStream({
                        write(chunk) {
                          console.log(chunk);
                        },
                      })
                    );

                    setRunProcess(tempRunProcess);

                    webContainer.on("server-ready", (port, url) => {
                      console.log(port, url);
                      setIframeUrl(url);
                    });
                  }}
                  className="p-2 px-4 bg-slate-300 text-white cursor-pointer"
                >
                  run
                </button>
              </div>
            </div>
            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
              {fileTree && fileTree[currentFile] && (
                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                  <pre className="hljs h-full">
                    <code
                      className="hljs h-full outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedContent = e.target.innerText;
                        const ft = {
                          ...fileTree,
                          [currentFile]: {
                            file: {
                              contents: updatedContent,
                            },
                          },
                        };
                        setFileTree(ft);
                        saveFileTree(ft);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: hljs.highlight(
                          "javascript",
                          fileTree[currentFile].file.contents
                        ).value,
                      }}
                      style={{
                        whiteSpace: "pre-wrap",
                        paddingBottom: "25rem",
                        counterSet: "line-numbering",
                      }}
                    />
                  </pre>
                </div>
              )}
            </div>
          </div>

          {iframeUrl && webContainer && (
            <div className="flex min-w-96 flex-col h-full">
              <div className="address-bar">
                <input
                  type="text"
                  onChange={(e) => setIframeUrl(e.target.value)}
                  value={iframeUrl}
                  className="w-full p-2 px-4 bg-slate-200"
                />
              </div>
              <iframe src={iframeUrl} className="w-full h-full"></iframe>
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-brightness-75 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
              <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select User</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2">
                  <i className="ri-close-fill"></i>
                </button>
              </header>
              <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer hover:bg-slate-200 ${
                      Array.from(selectedUserId).indexOf(user._id) != -1
                        ? "bg-slate-200"
                        : ""
                    } p-2 flex gap-2 items-center`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                ))}
              </div>
              <button
                onClick={addCollaborators}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 "
              >
                Add Collaborators
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Project;
