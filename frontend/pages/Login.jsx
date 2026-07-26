import { useState } from "react";
import fundoLogin from "../projeto/fundoLogin.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [LoginRegistro, setLoginRegistro] = useState("login");
  const submeter = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await api.post("/login", { email, senha });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao fazer login");
    }
  };
  const submeterRegistro = async (e) => {
    e.preventDefault();
    setErro('');
    try {
        await api.post('/register', {nome, email, senha});
        setLoginRegistro('login')
    } catch (error) {
        setErro(error.response?.data?.message || "Erro ao registrar")
    }
  }

  const bntLogin = (e) => {
    e.preventDefault();
    setLoginRegistro("login");
  };
  const btnRegistrar = (e) => {
    e.preventDefault();
    setLoginRegistro("registro");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex gap-2 absolute p-5 shrink-0  items-center">
        <div className="w-8 h-8 items-center flex overflow-hidden rounded-full">
          <img
            className="object-cover scale-300 object-center"
            src={fundoLogin}
          />
        </div>
        <h1 className="font-bold text-sm">Controle Financeiro</h1>
      </div>
      <div className=" flex justify-center p-10 items-center flex-1">
        <div className="bg-white flex rounded-3xl overflow-hidden">
          <div
            className=" w-1/2 p-5 bg-cover bg-center bg-no-repeat flex items-end text-center"
            style={{ backgroundImage: `url(${fundoLogin})` }}
          >
            <div className="flex flex-col gap-2 opacity-80 mb-3">
              <h1 className="font-bold text-2xl">Controle Financeiro</h1>
              <p className="text-gray-600 text-xs">
                Organize suas finanças, acompanhe seus ganhos e alcance seus
                objetivos
              </p>
            </div>
          </div>
            {LoginRegistro === "login" && (
                <form
                onSubmit={submeter}
                className="font-bold  w-1/2 py-15 gap-5 px-10 flex flex-col items-center text-xs"
                >
            
              {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}
            <div className=" flex  font-bold w-full">
              <button
                onClick={bntLogin}
                className="flex-1 py-2 border-b-2 border-blue-500 cursor-pointer text-blue-700"
              >
                Entrar
              </button>
              <button
                onClick={btnRegistrar}
                className="flex-1 py-2 border-b-2 border-gray-300 cursor-pointer text-gray-600"
              >
                Criar conta
              </button>
            </div>
              <div className=" w-full py-5 flex flex-col gap-5">
                <div className="text-gray-600 flex flex-col gap-1">
                  
                </div>
                <div className="text-gray-600 flex flex-col gap-1">
                  <p className="">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="text-gray-600 flex flex-col gap-1">
                  <p>Senha</p>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="w-full text-center flex flex-col gap-3 ">
                  <button
                    type="submit"
                    className="bg-indigo-500 w-full py-3 rounded-xl text-white font-bold shadow-md cursor-pointer"
                  >
                    Entrar
                  </button>
                  <p className="text-indigo-800 font-bold cursor-pointer">
                    Esqueci minha senha
                  </p>
                </div>
              </div>

            
          </form>
            )}

            {LoginRegistro === "registro" && (
                <form
                onSubmit={submeterRegistro}
                className="font-bold  w-1/2 py-15 gap-5 px-10 flex flex-col items-center text-xs"
                >
            
              {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}
            <div className=" flex  font-bold w-full">
              <button
                onClick={bntLogin}
                className="flex-1 py-2 border-b-2 border-gray-300 cursor-pointer text-gray-600"
              >
                Entrar
              </button>
              <button
                onClick={btnRegistrar}
                className="flex-1 py-2 border-b-2 border-blue-500 cursor-pointer text-blue-700"
              >
                Criar conta
              </button>
            </div>
              <div className=" w-full py-5 flex flex-col gap-5">
                <div className="text-gray-600 flex flex-col gap-1">
                    
                  <p className="">Nome</p>
                  <input
                    type="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Insira seu nome"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="text-gray-600 flex flex-col gap-1">
                    
                  <p className="">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Insira seu email"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="text-gray-600 flex flex-col gap-1">
                  <p>Senha</p>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Crie uma senha"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="w-full text-center flex flex-col gap-3 ">
                  <button
                    type="submit"
                    className="bg-indigo-500 w-full py-3 rounded-xl text-white font-bold shadow-md cursor-pointer"
                  >
                    Registrar
                  </button>

                </div>
              </div>

            
          </form>
            )}

        </div>
      </div>
    </div>
  );
}


/*{LoginRegistro === "registro" && (
              <div className=" w-full py-5 flex flex-col gap-5">
                <div className="text-gray-600 flex flex-col gap-1">
                  <p className="">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Insira seu email"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="text-gray-600 flex flex-col gap-1">
                  <p>Senha</p>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Crie uma senha"
                    className="p-2 border border-gray-200 w-full rounded-md outline-none"
                  />
                </div>
                <div className="w-full text-center flex flex-col gap-3 ">
                  <button
                    type="submit"
                    className="bg-indigo-500 w-full py-3 rounded-xl text-white font-bold shadow-md cursor-pointer"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            )}*/