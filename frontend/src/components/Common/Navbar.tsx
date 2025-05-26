import { Flex, Image, useBreakpointValue, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import Logo from "/assets/images/fastapi-logo.png"
import UserMenu from "./UserMenu"
import { useEffect, useState } from "react";

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" });
  const [dateTime, setDateTime] = useState(new Date());
  
     useEffect(() => {
      const intervalId = setInterval(() => {
        setDateTime(new Date());
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color="white"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={4}
    >
      <Link to="/">
        <Image src={Logo} alt="Logo" maxW="35%" p={2} />
      </Link>
      <Flex gap={2} alignItems="center">
        <Text> Fecha actual: {dateTime.toLocaleString("es-ES")}</Text>
      </Flex>
      <Flex gap={2} alignItems="center">
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
